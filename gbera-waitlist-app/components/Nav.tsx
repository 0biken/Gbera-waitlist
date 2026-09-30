'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from './art/Icons';
import styles from './Nav.module.css';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#stops', label: 'Pickup points' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open]);

  return (
    <header className={styles.wrap}>
      <nav className={styles.pill} aria-label="Primary">
        <a href="#top" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.mark} aria-hidden="true" />
          Gbera
        </a>

        <div className={styles.links}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} className={styles.link}>{l.label}</a>
          ))}
        </div>

        <a href="#waitlist" className={`btn btn-dark btn-sm ${styles.ctaDesk}`}>
          Join waitlist
          <span className="btn-icon"><ArrowUpRight size={18} /></span>
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`${styles.overlay} on-dark`}
        data-open={open}
        inert={!open}
      >
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={styles.overlayLink}
            style={{ '--i': i } as React.CSSProperties}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#waitlist"
          className={`btn btn-yellow ${styles.overlayLink} ${styles.overlayCta}`}
          style={{ '--i': LINKS.length } as React.CSSProperties}
          onClick={() => setOpen(false)}
        >
          Join the waitlist
          <span className="btn-icon"><ArrowUpRight size={20} /></span>
        </a>
      </div>
    </header>
  );
}
