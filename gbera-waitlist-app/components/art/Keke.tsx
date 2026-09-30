// Original keke (auto-rickshaw) side-view illustration: curved front cowl,
// single front wheel, open passenger side, enclosed rear panel.
// Colours are brand tokens so it can sit on yellow, black or paper.
interface Props {
  className?: string;
  body?: string;
  trim?: string;
  ground?: boolean;
}

export default function Keke({
  className,
  body = 'var(--yellow)',
  trim = 'var(--black)',
  ground = true,
}: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 170"
      fill="none"
      role="img"
      aria-label="Illustration of a campus keke"
    >
      {ground && <ellipse cx="132" cy="152" rx="104" ry="6" fill={trim} opacity="0.14" />}

      {/* canopy roof */}
      <path d="M84 26h128c9 0 16 7 16 16v4H66l6-10c3-6 7-10 12-10z" fill={trim} />

      {/* rear enclosed panel */}
      <path d="M196 46h32v74h-32z" fill={body} />
      <path d="M204 56h16v26h-16z" fill={trim} opacity="0.85" />

      {/* passenger bench seen through the open side */}
      <path d="M140 78c0-3 2-5 5-5h45c3 0 6 2 6 5v26h-56V78z" fill={trim} opacity="0.82" />

      {/* roof pillars */}
      <path d="M124 46v52" stroke={trim} strokeWidth="5" strokeLinecap="round" />

      {/* windscreen: glass then curved frame */}
      <path d="M72 46c-12 14-20 30-24 50h26l14-50H72z" fill={trim} opacity="0.22" />
      <path d="M72 46c-12 14-20 30-24 50" stroke={trim} strokeWidth="5" strokeLinecap="round" />

      {/* driver handlebar */}
      <path d="M78 84l14-4" stroke={trim} strokeWidth="3.5" strokeLinecap="round" />

      {/* lower body with rounded front nose */}
      <path
        d="M52 94h176v28a6 6 0 01-6 6H34a8 8 0 01-8-8c0-12 10-22 26-26z"
        fill={body}
      />
      <path d="M42 110h186" stroke={trim} strokeWidth="5" opacity="0.9" />

      {/* headlight */}
      <circle cx="33" cy="112" r="5" fill="#FFF8DC" stroke={trim} strokeWidth="2" />

      {/* rear mudguard */}
      <path d="M170 128a26 26 0 0152 0" fill={body} stroke={trim} strokeWidth="3" />

      {/* wheels: single front, rear */}
      <g>
        <circle cx="58" cy="132" r="16" fill={trim} />
        <circle cx="58" cy="132" r="6" fill={body} />
      </g>
      <g>
        <circle cx="196" cy="132" r="18" fill={trim} />
        <circle cx="196" cy="132" r="7" fill={body} />
      </g>
    </svg>
  );
}
