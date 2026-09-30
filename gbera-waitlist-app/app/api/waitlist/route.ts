import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import {
  CAMPUS_ZONES,
  FACULTIES,
  OCCUPATIONS,
  YEAR_LEVELS,
} from '@/lib/constants';

const FREQUENCIES = ['Daily', 'Several times a week', 'Rarely'] as const;
const ROLES = ['Rider', 'Driver', 'Both'] as const;
const MAX_BODY_BYTES = 8 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+?234|0)[789]\d{9}$/;

type Row = Record<string, unknown>;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T): T[number] | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T[number])
    : null;
}

function syncToGoogleSheets(row: Row) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;
  // Fire-and-forget: a Sheets failure must never break the signup
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  if (!rateLimit(`waitlist:${clientIp(req)}`, 6, 60_000)) {
    return fail('Too many attempts. Please wait a minute and try again.', 429);
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return fail('Invalid request body.', 400);
  }
  if (raw.length > MAX_BODY_BYTES) return fail('Request too large.', 413);

  let body: Row;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error();
    body = parsed as Row;
  } catch {
    return fail('Invalid JSON body', 400);
  }

  // --- Required fields ---
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return fail('A valid email address is required.', 422);
  }
  if (typeof body.is_ui_student !== 'boolean') {
    return fail('Please tell us if you are a UI student.', 422);
  }
  const role = oneOf(body.role_interest, ROLES);
  if (!role) return fail('Please select your role interest.', 422);
  if (typeof body.uses_keke !== 'boolean') {
    return fail('Please answer whether you use campus keke.', 422);
  }
  if (typeof body.uses_uber !== 'boolean') {
    return fail('Please answer whether you use Uber or similar apps.', 422);
  }

  // --- Optional fields (allow-listed) ---
  let phone: string | null = null;
  if (body.phone !== undefined && body.phone !== null && body.phone !== '') {
    const cleaned = typeof body.phone === 'string' ? body.phone.replace(/\s/g, '') : '';
    if (!PHONE_RE.test(cleaned)) {
      return fail('Please enter a valid Nigerian phone number, or leave the field empty.', 422);
    }
    phone = cleaned;
  }

  const zones = Array.isArray(body.preferred_zones)
    ? Array.from(new Set(body.preferred_zones.filter((z): z is string => typeof z === 'string')))
        .filter(z => (CAMPUS_ZONES as readonly string[]).includes(z))
    : [];

  const insertPayload = {
    email,
    phone,
    is_ui_student:   body.is_ui_student,
    faculty:         oneOf(body.faculty, FACULTIES),
    year_or_level:   oneOf(body.year_or_level, YEAR_LEVELS),
    has_graduated:   typeof body.has_graduated === 'boolean' ? body.has_graduated : null,
    occupation:      oneOf(body.occupation, OCCUPATIONS),
    role_interest:   role,
    uses_keke:       body.uses_keke,
    uses_uber:       body.uses_uber,
    frequency:       oneOf(body.frequency, FREQUENCIES),
    preferred_zones: zones.length ? zones : null,
    source:          (req.headers.get('referer') || '').slice(0, 300) || null,
    user_agent:      (req.headers.get('user-agent') || '').slice(0, 300) || null,
  };

  const admin = createAdminClient();
  const { data: inserted, error } = await admin
    .from('waitlist')
    .insert(insertPayload)
    .select('waitlist_position')
    .single();

  // 23505 = unique_violation. A repeat signup never overwrites the existing row:
  // otherwise anyone who knows an email could rewrite that person's details.
  if (error?.code === '23505') {
    return NextResponse.json({ position: null, duplicate: true });
  }

  if (error || !inserted) {
    console.error('Waitlist insert error:', error);
    return fail('Something went wrong. Please try again.', 500);
  }

  syncToGoogleSheets({ ...insertPayload, waitlist_position: inserted.waitlist_position });

  return NextResponse.json(
    { position: inserted.waitlist_position, duplicate: false },
    { status: 201 },
  );
}
