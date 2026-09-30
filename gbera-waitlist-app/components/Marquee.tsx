import styles from './Marquee.module.css';

const STOPS = [
  'Main Gate', 'Kuti Hall', 'SUB', 'Faculty of Science', 'Idia Hall',
  'University Library', 'Mellanby Hall', 'Sports Centre', 'Awo Hall', 'Faculty of Arts',
];

// Two identical groups: the track shifts by exactly -50%, so the loop is seamless.
export default function Marquee() {
  return (
    <div className={styles.band} role="region" aria-label="Some of the campus stops Gbera will serve">
      <p className="sr-only">Stops include {STOPS.join(', ')}.</p>
      <div className={styles.track} aria-hidden="true">
        {[0, 1].map(g => (
          <div key={g} className={styles.group}>
            {STOPS.map(s => (
              <span key={s} className={styles.item}>
                {s}
                <span className={styles.dot} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
