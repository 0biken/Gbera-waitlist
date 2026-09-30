import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { clientIp, rateLimit } from '@/lib/rate-limit';

// Called at most once per browser session (see PageViewBeacon)
export async function POST(req: NextRequest) {
  if (!rateLimit(`pageview:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ count: null }, { status: 429 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc('increment_page_views');

  if (error) {
    console.error('Page view increment error:', error);
    return NextResponse.json({ count: null }, { status: 500 });
  }

  return NextResponse.json({ count: Number(data) || 0 });
}
