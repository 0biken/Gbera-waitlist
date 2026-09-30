'use client';

import { useId, useState } from 'react';
import {
  FACULTIES,
  YEAR_LEVELS,
  OCCUPATIONS,
  CAMPUS_ZONES,
  type WaitlistFormData,
  type RoleInterest,
} from '@/lib/constants';
import { Alert, ArrowUpRight, Check, Lock } from './art/Icons';
import styles from './WaitlistForm.module.css';

const INITIAL_FORM: WaitlistFormData = {
  email: '',
  phone: '',
  is_ui_student: null,
  faculty: '',
  year_or_level: '',
  has_graduated: null,
  occupation: '',
  role_interest: null,
  uses_keke: null,
  uses_uber: null,
  frequency: '',
  preferred_zones: [],
};

const ROLES: RoleInterest[] = ['Rider', 'Driver', 'Both'];
const FREQUENCIES = ['Daily', 'Several times a week', 'Rarely'];

// Show the live count only once it reads as momentum rather than an empty room
const SOCIAL_PROOF_MIN = 50;

type Field = keyof WaitlistFormData;
type Errors = Partial<Record<Field | 'global', string>>;
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

// Order matters: the first invalid field in this list receives focus
const REQUIRED_ORDER: Field[] = ['email', 'phone', 'is_ui_student', 'role_interest', 'uses_keke', 'uses_uber'];

function YesNo({
  name,
  legend,
  value,
  onChange,
  error,
  optional,
}: {
  name: string;
  legend: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  error?: string;
  optional?: boolean;
}) {
  const errId = `${name}-error`;
  return (
    <fieldset className="field" aria-describedby={error ? errId : undefined}>
      <legend className="label" style={{ marginBottom: 8 }}>
        {legend}
        {optional ? <span className="opt">Optional</span> : <span className="req" aria-hidden="true">*</span>}
      </legend>
      <div className="choice-row grow" data-invalid={!!error}>
        {[true, false].map(v => (
          <label key={String(v)} className="choice" data-tone={v ? 'yes' : 'no'}>
            <input
              type="radio"
              id={`${name}-${v ? 'yes' : 'no'}`}
              name={name}
              checked={value === v}
              onChange={() => onChange(v)}
              required={!optional}
            />
            {v ? 'Yes' : 'No'}
          </label>
        ))}
      </div>
      {error && <p className="form-error" id={errId}>{error}</p>}
    </fieldset>
  );
}

export default function WaitlistForm({ signupCount }: { signupCount: number }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [form, setForm] = useState<WaitlistFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [result, setResult] = useState<{ position: number | null; duplicate: boolean } | null>(null);

  function set<K extends Field>(key: K, value: WaitlistFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined, global: undefined }));
  }

  function toggleZone(zone: string) {
    setForm(prev => ({
      ...prev,
      preferred_zones: prev.preferred_zones.includes(zone)
        ? prev.preferred_zones.filter(z => z !== zone)
        : [...prev.preferred_zones, zone],
    }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (form.phone && !/^(\+?234|0)[789]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      e.phone = 'Enter a Nigerian number like 0812 345 6789, or leave it empty.';
    }
    if (form.is_ui_student === null) e.is_ui_student = 'Choose yes or no.';
    if (!form.role_interest) e.role_interest = 'Choose how you want to use Gbera.';
    if (form.uses_keke === null) e.uses_keke = 'Choose yes or no.';
    if (form.uses_uber === null) e.uses_uber = 'Choose yes or no.';
    return e;
  }

  function focusFirstError(e: Errors) {
    const first = REQUIRED_ORDER.find(k => e[k]);
    if (!first) return;
    const target =
      first === 'email' || first === 'phone'
        ? document.getElementById(id(first))
        : document.querySelector<HTMLInputElement>(`input[name="${id(first)}"]`);
    target?.focus();
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirstError(e);
      return;
    }

    setSubmitState('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors({ global: data.error || 'Something went wrong. Please try again.' });
        setSubmitState('error');
        return;
      }
      setResult({ position: data.position ?? null, duplicate: !!data.duplicate });
      setSubmitState('success');
    } catch {
      setErrors({ global: 'Network error. Check your connection and try again.' });
      setSubmitState('error');
    }
  }

  const errProps = (k: Field) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': id(`${k}-error`) } : {};

  return (
    <section className={`${styles.section} on-dark`} id="waitlist">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside} data-reveal>
          <h2 className="t-title">Be first to ride.</h2>
          <p className={`t-lead ${styles.lead}`}>
            Join the waitlist and we&apos;ll email you the day Gbera opens at the University of Ibadan.
          </p>
          <ul className={styles.perks}>
            <li><Check size={18} /> Early access before public launch</li>
            <li><Check size={18} /> Help decide the first pickup points</li>
            <li><Check size={18} /> Takes about a minute. Free, no commitment.</li>
          </ul>
          {signupCount >= SOCIAL_PROOF_MIN && (
            <p className={styles.count}>
              <b>{signupCount.toLocaleString()}</b> people already waiting
            </p>
          )}
        </div>

        <div className="shell shell-dark" data-reveal>
          {submitState === 'success' && result ? (
            <div className={`core ${styles.success}`} role="status" aria-live="polite">
              <span className={styles.successIcon}><Check size={30} /></span>
              {result.duplicate ? (
                <>
                  <h3 className="t-heading">You&apos;re already on the list.</h3>
                  <p>That email is signed up. We&apos;ll be in touch as soon as Gbera opens.</p>
                </>
              ) : (
                <>
                  <h3 className="t-heading">You&apos;re on the list.</h3>
                  {result.position != null && (
                    <span className={styles.position}>#{result.position.toLocaleString()}</span>
                  )}
                  <p>We&apos;ll email you as soon as Gbera opens at the University of Ibadan.</p>
                </>
              )}
            </div>
          ) : (
            <div className={`core ${styles.formCore}`}>
              <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.group}>
                  <div className={styles.two}>
                    <div className="field">
                      <label htmlFor={id('email')} className="label">
                        Email address<span className="req" aria-hidden="true">*</span>
                      </label>
                      <input
                        id={id('email')}
                        type="email"
                        className="input"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        autoComplete="email"
                        inputMode="email"
                        required
                        {...errProps('email')}
                      />
                      {errors.email && <p className="form-error" id={id('email-error')}>{errors.email}</p>}
                    </div>

                    <div className="field">
                      <label htmlFor={id('phone')} className="label">
                        Phone number<span className="opt">Optional</span>
                      </label>
                      <input
                        id={id('phone')}
                        type="tel"
                        className="input"
                        placeholder="0812 345 6789"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        autoComplete="tel"
                        inputMode="tel"
                        {...errProps('phone')}
                      />
                      {errors.phone && <p className="form-error" id={id('phone-error')}>{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.group}>
                  <YesNo
                    name={id('is_ui_student')}
                    legend="Are you (or were you) a University of Ibadan student?"
                    value={form.is_ui_student}
                    error={errors.is_ui_student}
                    onChange={v => {
                      set('is_ui_student', v);
                      if (v) set('occupation', '');
                      else {
                        set('faculty', '');
                        set('year_or_level', '');
                        set('has_graduated', null);
                      }
                    }}
                  />

                  {form.is_ui_student === true && (
                    <div className={styles.conditional}>
                      <div className={styles.two}>
                        <div className="field">
                          <label htmlFor={id('faculty')} className="label">Faculty<span className="opt">Optional</span></label>
                          <select id={id('faculty')} className="input" value={form.faculty} onChange={e => set('faculty', e.target.value)}>
                            <option value="">Select your faculty</option>
                            {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="field">
                          <label htmlFor={id('level')} className="label">Year or level<span className="opt">Optional</span></label>
                          <select id={id('level')} className="input" value={form.year_or_level} onChange={e => set('year_or_level', e.target.value)}>
                            <option value="">Select your level</option>
                            {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </div>
                      <YesNo
                        name={id('has_graduated')}
                        legend="Have you graduated?"
                        value={form.has_graduated}
                        onChange={v => set('has_graduated', v)}
                        optional
                      />
                    </div>
                  )}

                  {form.is_ui_student === false && (
                    <div className={`field ${styles.conditional}`}>
                      <label htmlFor={id('occupation')} className="label">Occupation<span className="opt">Optional</span></label>
                      <select id={id('occupation')} className="input" value={form.occupation} onChange={e => set('occupation', e.target.value)}>
                        <option value="">Select</option>
                        {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div className={styles.divider} />

                <div className={styles.group}>
                  <fieldset className="field" aria-describedby={errors.role_interest ? id('role_interest-error') : undefined}>
                    <legend className="label" style={{ marginBottom: 8 }}>
                      I want to join as a<span className="req" aria-hidden="true">*</span>
                    </legend>
                    <div className="choice-row grow" data-invalid={!!errors.role_interest}>
                      {ROLES.map(r => (
                        <label key={r} className="choice">
                          <input
                            type="radio"
                            name={id('role_interest')}
                            checked={form.role_interest === r}
                            onChange={() => set('role_interest', r)}
                            required
                          />
                          {r}
                        </label>
                      ))}
                    </div>
                    {errors.role_interest && <p className="form-error" id={id('role_interest-error')}>{errors.role_interest}</p>}
                  </fieldset>

                  <YesNo
                    name={id('uses_keke')}
                    legend="Do you currently use campus keke?"
                    value={form.uses_keke}
                    error={errors.uses_keke}
                    onChange={v => set('uses_keke', v)}
                  />
                  <YesNo
                    name={id('uses_uber')}
                    legend="Do you use Uber or similar ride-hailing apps?"
                    value={form.uses_uber}
                    error={errors.uses_uber}
                    onChange={v => set('uses_uber', v)}
                  />
                </div>

                <div className={styles.divider} />

                <div className={styles.group}>
                  <fieldset className="field">
                    <legend className="label" style={{ marginBottom: 8 }}>
                      How often do you move around campus?<span className="opt">Optional</span>
                    </legend>
                    <div className="choice-row">
                      {FREQUENCIES.map(f => (
                        <label key={f} className="choice chip">
                          <input
                            type="radio"
                            name={id('frequency')}
                            checked={form.frequency === f}
                            onChange={() => set('frequency', f)}
                          />
                          {f}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <legend className="label" style={{ marginBottom: 4 }}>
                      Preferred pickup points<span className="opt">Optional</span>
                    </legend>
                    <p className={styles.hint}>Pick all that apply.</p>
                    <div className="choice-row">
                      {CAMPUS_ZONES.map(zone => (
                        <label key={zone} className="choice chip">
                          <input
                            type="checkbox"
                            checked={form.preferred_zones.includes(zone)}
                            onChange={() => toggleZone(zone)}
                          />
                          {zone}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <p className={`t-small ${styles.privacy}`}>
                  <Lock size={18} />
                  <span>
                    We only use your email and phone number to tell you when Gbera launches and
                    for related campus-mobility updates. Unsubscribe anytime. We never sell or share your data.
                  </span>
                </p>

                {errors.global && (
                  <div className={styles.globalError} role="alert">
                    <Alert size={18} />
                    {errors.global}
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn-yellow ${styles.submit}`}
                  disabled={submitState === 'loading'}
                  aria-busy={submitState === 'loading'}
                >
                  {submitState === 'loading' ? 'Joining the waitlist' : 'Join the waitlist'}
                  <span className="btn-icon">
                    {submitState === 'loading'
                      ? <span className={styles.spinner} aria-hidden="true" />
                      : <ArrowUpRight size={20} />}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
