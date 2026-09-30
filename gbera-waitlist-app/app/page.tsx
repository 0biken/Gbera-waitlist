import { createAdminClient } from '@/lib/supabase';
import Nav from '@/components/Nav';
import HeroSection from '@/components/HeroSection';
import Marquee from '@/components/Marquee';
import WhyGberaSection from '@/components/WhyGberaSection';
import HowItWorks from '@/components/HowItWorks';
import Stops from '@/components/Stops';
import WaitlistForm from '@/components/WaitlistForm';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import PageViewBeacon from '@/components/PageViewBeacon';

export const revalidate = 60; // ISR: re-render at most every 60 seconds

async function getSignupCount(): Promise<number> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from('waitlist_stats').select('total_signups').single();
    return Number(data?.total_signups) || 0;
  } catch {
    return 0;
  }
}

export default async function Home() {
  const signupCount = await getSignupCount();

  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <Marquee />
        <WhyGberaSection />
        <HowItWorks />
        <Stops />
        <WaitlistForm signupCount={signupCount} />
      </main>
      <Footer />
      <Motion />
      <PageViewBeacon />
    </>
  );
}
