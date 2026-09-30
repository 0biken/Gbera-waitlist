'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, NO_REDUCED_MOTION } from '@/lib/gsap';
import CampusMap from './art/CampusMap';
import Keke from './art/Keke';
import styles from './Stops.module.css';

const GROUPS = [
  {
    key: 'halls',
    title: 'Halls',
    tone: styles.halls,
    stops: ['Kuti Hall', 'Mellanby Hall', 'Idia Hall', 'Queen Elizabeth Hall', 'Alexander Brown Hall', 'Nnamdi Azikiwe Hall', 'Awo Hall'],
  },
  {
    key: 'faculties',
    title: 'Faculties',
    tone: styles.faculties,
    stops: ['Faculty of Science', 'Faculty of Arts', 'Faculty of Social Sciences', 'Faculty of Technology', 'College of Medicine / UCH', 'Institute of African Studies'],
  },
  {
    key: 'landmarks',
    title: 'Landmarks',
    tone: styles.landmarks,
    stops: ['Main Gate', 'Student Union Building (SUB)', 'University Library', 'Sports Centre', 'Staff Quarters'],
  },
];

export default function Stops() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState('halls');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const map = `.${styles.mapShell}`;
        gsap.fromTo(
          map,
          { scale: 0.8, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: map, start: 'top bottom', end: 'center 60%', scrub: 0.8 },
          },
        );
        gsap.to(map, {
          opacity: 0.2,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: map, start: 'bottom 35%', end: 'bottom top', scrub: 0.8 },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="stops">
      <div className="container">
        <div className={styles.head} data-reveal>
          <h2 className="t-title">Pickup points you already know.</h2>
          <p className="t-lead">
            Stops are named after the places you actually say out loud, so drivers
            know exactly where to find you.
          </p>
        </div>

        <div className={`shell ${styles.mapShell}`}>
          <div className={`core ${styles.mapCore}`}>
            <CampusMap />
            <div className={styles.legend} aria-hidden="true">
              <span><i /> Pickup point</span>
              <span><i className={styles.route} /> Live route</span>
            </div>
          </div>
        </div>

        <div className={styles.accordion}>
          {GROUPS.map(g => {
            const isOpen = open === g.key;
            return (
              <div
                key={g.key}
                className={`${styles.slice} ${g.tone}`}
                data-open={isOpen}
                onMouseEnter={() => setOpen(g.key)}
                data-reveal
              >
                <button
                  type="button"
                  className={styles.sliceBtn}
                  aria-expanded={isOpen}
                  aria-controls={`stops-${g.key}`}
                  onClick={() => setOpen(g.key)}
                  onFocus={() => setOpen(g.key)}
                >
                  <span className={styles.sliceTitle}>{g.title}</span>
                  <span className={styles.count} aria-label={`${g.stops.length} stops`}>{g.stops.length}</span>
                </button>
                <div className={styles.art} aria-hidden="true">
                  <Keke ground={false} body={g.key === 'halls' ? 'var(--paper)' : 'var(--yellow)'} trim={g.key === 'faculties' ? '#2A2A26' : 'var(--black)'} />
                </div>
                <div className={styles.body} id={`stops-${g.key}`}>
                  <ul className={styles.list}>
                    {g.stops.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
