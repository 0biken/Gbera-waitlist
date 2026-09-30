'use client';

import { useRef } from 'react';
import { gsap, useGSAP, NO_REDUCED_MOTION } from '@/lib/gsap';
import CampusMap from './art/CampusMap';
import Keke from './art/Keke';
import { Check, Route } from './art/Icons';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    tone: styles.toneA,
    title: 'Drop a pin on campus.',
    body: 'Choose a real landmark: your hall, your faculty gate, the SUB. No street addresses to guess.',
    visual: (
      <div className={`${styles.visual}`}>
        <div className={styles.mapFrame}>
          <CampusMap />
        </div>
      </div>
    ),
  },
  {
    tone: styles.toneB,
    title: 'Shared or exclusive. Price locked.',
    body: 'Split the ride with students going your way, or take the keke to yourself. Either way the fare is fixed before you board.',
    visual: (
      <div className={`${styles.visual} ${styles.visualB}`}>
        <div className={styles.options}>
          <div className={styles.option} data-on="true">
            <span><b>Shared</b><small>Up to 3 riders, same direction</small></span>
            <strong>₦250</strong>
          </div>
          <div className={styles.option}>
            <span><b>Exclusive</b><small>Just you, dispatched now</small></span>
            <strong>₦500</strong>
          </div>
        </div>
      </div>
    ),
  },
  {
    tone: styles.toneC,
    title: 'Watch your driver arrive.',
    body: 'Every driver is verified. Follow the keke live on the map and share the trip link with a friend.',
    visual: (
      <div className={`${styles.visual} ${styles.visualC}`}>
        <span className={styles.etaChip}><span className={styles.live} />Arriving in 3 min</span>
        <div className={styles.road} />
        <div className={styles.driveKeke}><Keke /></div>
      </div>
    ),
  },
  {
    tone: styles.toneD,
    title: 'Arrive. Fare released.',
    body: 'Payment leaves escrow only when the trip is confirmed. If a driver cancels, you keep your place in the queue.',
    visual: (
      <div className={`${styles.visual} ${styles.visualD}`}>
        <div className={styles.receipt}>
          <div className={styles.receiptTop}>
            <span className={styles.tick}><Check size={20} /></span>
            <span><b>Trip complete</b><small>Main Gate to Faculty of Science</small></span>
          </div>
          <div className={styles.row}><span>Shared fare</span><b>₦250</b></div>
          <div className={styles.queue}><Route size={16} /> Driver cancels? Your queue spot is kept.</div>
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const wraps = gsap.utils.toArray<HTMLElement>(`.${styles.cardWrap}`);
        wraps.forEach((wrap, i) => {
          const next = wraps[i + 1];
          if (!next) return;
          const card = wrap.querySelector(`.${styles.card}`);
          const veil = wrap.querySelector(`.${styles.veil}`);
          const tl = gsap.timeline({
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
          });
          tl.to(card, { scale: 0.92, ease: 'none' }, 0).to(veil, { opacity: 0.5, ease: 'none' }, 0);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`${styles.section} on-dark`} id="how">
      <div className="container">
        <div className={styles.head} data-reveal>
          <h2 className="t-title">From pin to pickup, no haggling.</h2>
          <p className="t-lead">Four steps, the same price every time, and a verified driver at the end of each one.</p>
        </div>

        <ol className={styles.stack}>
          {STEPS.map((s, i) => (
            <li key={s.title} className={styles.cardWrap} style={{ '--i': i } as React.CSSProperties}>
              <div className={`shell ${i === 2 ? 'shell-dark' : ''} ${styles.card}`}>
                <div className={`core ${styles.inner} ${s.tone}`}>
                  <div className={styles.text}>
                    <h3 className="t-heading">{s.title}</h3>
                    <p className="t-body">{s.body}</p>
                  </div>
                  <div aria-hidden="true" style={{ height: '100%' }}>{s.visual}</div>
                  <span className={styles.veil} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
