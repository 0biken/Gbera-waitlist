import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Geist } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Gbera — Campus Transit, Finally Sorted',
  description:
    'Flat-rate keke rides for University of Ibadan students. Safe, trackable, and built for campus life. Join the waitlist.',
  openGraph: {
    title: 'Gbera — Campus Transit, Finally Sorted',
    description:
      'Flat-rate keke rides for University of Ibadan students. Join the waitlist and be first to ride.',
    type: 'website',
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gbera — Campus Transit, Finally Sorted',
    description: 'Flat-rate keke rides for University of Ibadan students.',
  },
  keywords: ['gbera', 'university of ibadan', 'campus transport', 'keke', 'ride sharing', 'UI students'],
};

export const viewport: Viewport = {
  themeColor: '#FFC300',
  width: 'device-width',
  initialScale: 1,
};

// Runs before first paint so scroll-reveal elements start hidden only when JS is available.
// Failsafe: if the motion script never boots (bundle error, blocked JS), reveal everything.
const JS_FLAG = `(function(d){d.classList.add('js');setTimeout(function(){d.classList.add('reveal-fallback')},4000)})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${geist.variable}`}>{children}</body>
    </html>
  );
}
