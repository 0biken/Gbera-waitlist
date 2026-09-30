import CampusMap from './art/CampusMap';
import Keke from './art/Keke';
import { Check, Lock, Pin, Shield, Tag, Users } from './art/Icons';
import styles from './WhyGberaSection.module.css';

export default function WhyGberaSection() {
  return (
    <section className={styles.section} id="features">
      <div className="container">
        <h2 className={`t-title ${styles.title}`} data-reveal>
          Everything broken about campus keke
          <span className={`${styles.inlineImg} ${styles.inlineKeke}`} aria-hidden="true">
            <Keke ground={false} />
          </span>
          fixed in one app
          <span className={`${styles.inlineImg} ${styles.inlineMap}`} aria-hidden="true">
            <CampusMap labels={false} showRoute={false} pins={[{ x: 380, y: 320, label: 'SUB' }]} />
          </span>
        </h2>

        <div className={styles.grid}>
          {/* 2x2 — campus-aware map */}
          <article className={`shell ${styles.card} ${styles.map}`} data-reveal>
            <div className={`core ${styles.mapCore}`}>
              <div className={`${styles.visual} ${styles.mapVisual}`}>
                <CampusMap />
              </div>
              <div className={styles.mapPlate}>
                <h3 className={styles.cardTitle}>Built for UI, not the city.</h3>
                <p className={`t-body ${styles.cardBody}`}>
                  A campus map layer that drops the city clutter and marks real
                  landmarks, like Kuti Hall, the faculty gates and the SUB, as pickup points.
                </p>
              </div>
            </div>
          </article>

          {/* 2x1 — flat fares */}
          <article className={`shell ${styles.card} ${styles.fares}`} data-reveal>
            <div className={`core ${styles.faresCore}`}>
              <div className={styles.split}>
                <h3 className={styles.cardTitle}>No haggling. Ever.</h3>
                <span className={styles.iconBadge}><Tag size={20} /></span>
              </div>
              <p className={`t-body ${styles.cardBody}`}>
                The price you see is the price you pay. The operator cannot change it.
              </p>
              <div className={styles.fareRow}>
                <div className={styles.fare}><b>₦200</b><span>Shared, from</span></div>
                <div className={styles.fare}><b>₦500</b><span>Exclusive, flat</span></div>
              </div>
            </div>
          </article>

          {/* 1x2 — safety */}
          <article className={`shell shell-dark ${styles.card} ${styles.safety}`} data-reveal>
            <div className={`core ${styles.safetyCore}`}>
              <div className={styles.split}>
                <h3 className={styles.cardTitle}>Safety built in.</h3>
                <span className={styles.iconBadge}><Shield size={20} /></span>
              </div>
              <div className={`${styles.sos} ${styles.visual}`} aria-hidden="true">
                <i /><i /><i />
                <b>SOS</b>
              </div>
              <ul className={styles.safeList}>
                <li><Check size={18} /> One tap alerts campus security</li>
                <li><Check size={18} /> Share a live trip link with a friend</li>
                <li><Check size={18} /> Your number is never shown</li>
              </ul>
            </div>
          </article>

          {/* 1x2 — escrow */}
          <article className={`shell ${styles.card} ${styles.escrow}`} data-reveal>
            <div className={`core ${styles.escrowCore}`}>
              <div className={styles.split}>
                <h3 className={styles.cardTitle}>Held, not taken.</h3>
                <span className={styles.iconBadge}><Lock size={20} /></span>
              </div>
              <p className={`t-body ${styles.cardBody}`}>
                Your fare waits in escrow until the trip is confirmed complete.
              </p>
              <ol className={`${styles.flow} ${styles.visual}`}>
                <li className={styles.step}>
                  <span className={styles.stepDot}><Tag size={18} /></span>
                  <span><b>Book</b><small>Fare set from your wallet</small></span>
                </li>
                <li className={styles.stem} aria-hidden="true" />
                <li className={styles.step}>
                  <span className={styles.stepDot}><Lock size={18} /></span>
                  <span><b>Held</b><small>Locked during the ride</small></span>
                </li>
                <li className={styles.stem} aria-hidden="true" />
                <li className={styles.step}>
                  <span className={styles.stepDot}><Check size={18} /></span>
                  <span><b>Released</b><small>Paid when you arrive</small></span>
                </li>
              </ol>
            </div>
          </article>

          {/* 2x1 — verified drivers */}
          <article className={`shell ${styles.card} ${styles.verified}`} data-reveal>
            <div className={`core ${styles.verifiedCore}`}>
              <div className={styles.split}>
                <h3 className={styles.cardTitle}>Only campus-approved drivers.</h3>
                <span className={styles.iconBadge}><Users size={20} /></span>
              </div>
              <div className={`${styles.checks} ${styles.visual}`}>
                <div className={styles.check}><Shield size={22} /> Vetted by the university transport authority</div>
                <div className={styles.check}><Pin size={22} /> Keke physically inspected</div>
                <div className={styles.check}><Check size={22} /> Approved by Gbera before trip one</div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
