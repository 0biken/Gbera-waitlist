'use client';

import { gsap, ScrollTrigger, useGSAP, NO_REDUCED_MOTION } from '@/lib/gsap';

// Drives every [data-reveal] element: a heavy fade-up as it enters the viewport.
// Only transform and opacity are animated.
export default function Motion() {
  useGSAP(() => {
    document.documentElement.classList.add('motion-ready');
    const mm = gsap.matchMedia();

    // Reduced motion: show everything immediately
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 });
    });

    mm.add(NO_REDUCED_MOTION, () => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: els =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.09,
            overwrite: true,
          }),
      });
    });

    // Fonts and illustrations shift layout after first paint
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, []);

  return null;
}
