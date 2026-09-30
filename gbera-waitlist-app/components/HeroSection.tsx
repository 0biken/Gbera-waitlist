import PhoneMock from './art/PhoneMock';
import Keke from './art/Keke';
import { ArrowDown, ArrowUpRight } from './art/Icons';
import styles from './HeroSection.module.css';

const d = (n: number) => ({ '--d': n }) as React.CSSProperties;

export default function HeroSection() {
  return (
    <section className={styles.hero} id="top">
      <svg className={styles.roads} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#121212" strokeWidth="1.2">
          <path d="M-40 720 C 260 700 420 520 760 500 S 1180 300 1500 60" />
          <path d="M-40 780 C 300 770 460 590 800 570 S 1200 380 1500 140" />
          <path d="M240 940 C 300 700 520 560 640 300 S 700 40 760 -40" />
        </g>
      </svg>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <h1 className={`t-display ${styles.headline}`}>
            <span className={styles.line}><span className={styles.lineInner} style={d(0)}>Campus transit,</span></span>
            <span className={styles.line}><span className={styles.lineInner} style={d(1)}>finally sorted.</span></span>
          </h1>

          <p className={`t-lead ${styles.sub} ${styles.fade}`} style={d(0)}>
            Flat-rate keke rides with verified drivers and real-time tracking.
            Built for University of Ibadan students, not the city.
          </p>

          <div className={`${styles.ctas} ${styles.fade}`} style={d(1)}>
            <a href="#waitlist" className="btn btn-dark">
              Secure your spot
              <span className="btn-icon"><ArrowUpRight size={20} /></span>
            </a>
            <a href="#how" className="btn btn-light">
              See how it works
              <span className="btn-icon"><ArrowDown size={20} /></span>
            </a>
          </div>

          <p className={`t-small ${styles.note} ${styles.fade}`} style={d(2)}>Free to join. No commitment.</p>
        </div>

        <div className={styles.art} aria-hidden="true">
          <div className={styles.phoneWrap}>
            <div className={styles.rise}>
              <div className={styles.floatY}>
                <PhoneMock />
              </div>
            </div>
          </div>

          <div className={`shell ${styles.kekeCard}`}>
            <div className={`core ${styles.kekeCore}`}>
              <Keke />
              <p>
                One price, agreed up front
                <small>Shared from ₦200. Exclusive ₦500.</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
