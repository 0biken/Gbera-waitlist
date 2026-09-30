'use client';

import { useId, useSyncExternalStore } from 'react';
import styles from './CampusMap.module.css';

// Stylised campus map — an original illustration, not a real survey.
// The route runs along the main road, so both share the same path segments.
const MAIN_ROAD =
  'M -20 482 C 40 480 60 478 90 476 C 200 468 250 340 380 320 S 560 240 640 140 S 760 30 830 10';
const ROUTE = 'M 90 476 C 200 468 250 340 380 320 S 560 240 640 140';

const CROSS_ROADS = [
  'M 120 -20 C 150 120 260 200 380 320 S 420 480 520 640',
  'M -20 250 C 150 260 260 200 400 190 S 640 190 830 230',
  'M 560 640 C 580 520 640 420 830 400',
];

const BUILDINGS: Array<[number, number, number, number]> = [
  [30, 60, 120, 90], [190, 40, 90, 70], [300, 90, 70, 60], [470, 60, 110, 70],
  [640, 220, 100, 80], [90, 330, 100, 80], [250, 500, 100, 70], [560, 330, 90, 90],
  [690, 470, 80, 80], [440, 380, 60, 60], [580, 30, 60, 60], [20, 520, 60, 60],
];

const LAWNS = [
  'M 40 180 C 80 140 160 150 190 200 C 210 250 150 290 90 280 C 40 270 20 220 40 180 Z',
  'M 470 420 C 520 390 620 400 640 450 C 650 500 580 540 520 530 C 470 520 440 450 470 420 Z',
  'M 300 20 C 350 0 430 20 440 60 C 450 110 380 130 330 110 C 290 95 280 40 300 20 Z',
  'M 650 320 C 700 300 770 320 780 370 C 785 420 720 440 675 420 C 635 400 625 340 650 320 Z',
];

const RM_QUERY = '(prefers-reduced-motion: reduce)';
function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
const getReducedMotion = () => window.matchMedia(RM_QUERY).matches;

export interface MapPin {
  x: number;
  y: number;
  label: string;
  side?: 'left' | 'right';
}

const DEFAULT_PINS: MapPin[] = [
  { x: 90, y: 476, label: 'Main Gate' },
  { x: 380, y: 320, label: 'SUB' },
  { x: 640, y: 140, label: 'Faculty of Science', side: 'left' },
  { x: 214, y: 232, label: 'Kuti Hall' },
  { x: 436, y: 468, label: 'Library' },
];

interface Props {
  className?: string;
  pins?: MapPin[];
  showRoute?: boolean;
  labels?: boolean;
}

export default function CampusMap({ className, pins = DEFAULT_PINS, showRoute = true, labels = true }: Props) {
  const uid = useId().replace(/:/g, '');
  const routeId = `route-${uid}`;
  const reduce = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  return (
    <svg
      className={`${styles.map} ${className ?? ''}`}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustrated map of a university campus with pickup points and a route"
    >
      <rect width="800" height="600" fill="#F1EEE3" />

      {LAWNS.map((d, i) => (
        <path key={i} d={d} fill="#0A8754" opacity="0.13" />
      ))}

      {BUILDINGS.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill="#E6E1D0" />
      ))}

      {/* roads: casing first, then surface */}
      {[MAIN_ROAD, ...CROSS_ROADS].map((d, i) => (
        <path key={`c${i}`} d={d} stroke="#D9D4C2" strokeWidth={i === 0 ? 30 : 22} strokeLinecap="round" fill="none" />
      ))}
      {[MAIN_ROAD, ...CROSS_ROADS].map((d, i) => (
        <path key={`r${i}`} d={d} stroke="#FFFDF7" strokeWidth={i === 0 ? 24 : 16} strokeLinecap="round" fill="none" />
      ))}

      {showRoute && (
        <>
          <path id={routeId} d={ROUTE} stroke="#FFC300" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.55" />
          <path d={ROUTE} stroke="#121212" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 14" fill="none" />
        </>
      )}

      {pins.map(p => {
        const left = p.side === 'left';
        const w = p.label.length * 11.5 + 30;
        return (
          <g key={`${p.x}-${p.y}`}>
            <circle className={styles.ring} cx={p.x} cy={p.y} r="12" fill="#FFC300" />
            <circle cx={p.x} cy={p.y} r="11" fill="#FFC300" stroke="#121212" strokeWidth="3.5" />
            <circle cx={p.x} cy={p.y} r="3.5" fill="#121212" />
            {labels && (
              <g transform={`translate(${left ? p.x - 22 - w : p.x + 22} ${p.y - 18})`}>
                <rect width={w} height="36" rx="18" fill="#FFFDF7" stroke="#121212" strokeOpacity="0.14" />
                <text className={styles.label} x={w / 2} y="24" textAnchor="middle">{p.label}</text>
              </g>
            )}
          </g>
        );
      })}

      {showRoute && (
        <g>
          {/* vehicle marker: travels the route, or rests mid-route for reduced motion */}
          <circle r="20" fill="#121212" opacity="0.14" cx={reduce ? 380 : undefined} cy={reduce ? 320 : undefined}>
            {!reduce && <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href={`#${routeId}`} /></animateMotion>}
          </circle>
          <circle r="13" fill="#121212" stroke="#FFC300" strokeWidth="4" cx={reduce ? 380 : undefined} cy={reduce ? 320 : undefined}>
            {!reduce && <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href={`#${routeId}`} /></animateMotion>}
          </circle>
        </g>
      )}
    </svg>
  );
}
