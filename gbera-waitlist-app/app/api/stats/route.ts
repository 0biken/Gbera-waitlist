import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const revalidate = 30; // ISR: re-fetch at most every 30 seconds

export async function GET() {
  const admin = createAdminClient();

  // Get total signups and page views from the public stats view
  const { data, error } = await admin
    .from('waitlist_stats')
    .select('total_signups, page_views')
    .single();

  if (error || !data) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ total_signups: 0, page_views: 0 });
  }

  return NextResponse.json({
    total_signups: Number(data.total_signups) || 0,
    page_views: Number(data.page_views) || 0,
  });
}
