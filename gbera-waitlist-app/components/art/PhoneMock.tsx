import CampusMap from './CampusMap';
import { Check } from './Icons';
import styles from './PhoneMock.module.css';

// Decorative product UI. Hidden from assistive tech: it illustrates, it does not inform.
export default function PhoneMock({ className }: { className?: string }) {
  return (
    <div className={`${styles.phone} ${className ?? ''}`} aria-hidden="true">
      <div className={styles.screen}>
        <span className={styles.island} />
        <div className={styles.map}>
          <CampusMap labels={false} pins={[{ x: 90, y: 476, label: '' }, { x: 640, y: 140, label: '' }]} />
        </div>
        <div className={styles.sheet}>
          <span className={styles.grab} />
          <div className={styles.driver}>
            <span className={styles.avatar}>UI</span>
            <div className={styles.who}>
              <b>Your driver is close</b>
              <span><Check size={13} /> Verified, Keke UI-214</span>
            </div>
            <span className={styles.eta}>3 min</span>
          </div>
          <div className={styles.fare}>
            <span>Shared ride</span>
            <b>₦250</b>
          </div>
          <div className={styles.cta}>Confirm pickup</div>
        </div>
      </div>
    </div>
  );
}
