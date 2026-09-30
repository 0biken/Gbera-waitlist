import { ArrowUpRight } from './art/Icons';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top} data-reveal>
          <h2 className="t-title">Your next ride starts on campus.</h2>
          <a href="#waitlist" className="btn btn-dark">
            Join the waitlist
            <span className="btn-icon"><ArrowUpRight size={20} /></span>
          </a>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h3>Explore</h3>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#stops">Pickup points</a>
          </div>
          <div className={styles.col}>
            <h3>Contact</h3>
            <a href="mailto:hello@gbera.ng">hello@gbera.ng</a>
          </div>
          <div className={styles.col}>
            <h3>Where</h3>
            <p>University of Ibadan<br />Oyo State, Nigeria</p>
          </div>
        </div>

        <div className={styles.wordmark} aria-hidden="true">Gbera</div>

        <div className={styles.legal}>
          <span>© {year} Gbera</span>
          <span>Waitlist data is used only for launch updates. No account is created.</span>
        </div>
      </div>
    </footer>
  );
}
