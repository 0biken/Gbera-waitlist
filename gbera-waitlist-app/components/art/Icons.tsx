import type { SVGProps } from 'react';

// Hairline icon set (1.4px stroke, round caps) — drawn to a 24px grid.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowUpRight = (p: IconProps) => (
  <Base {...p}><path d="M7 17L17 7M8.5 7H17v8.5" /></Base>
);

export const ArrowDown = (p: IconProps) => (
  <Base {...p}><path d="M12 5v14M6 13l6 6 6-6" /></Base>
);

export const Check = (p: IconProps) => (
  <Base {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Base>
);

export const Pin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Base>
);

export const Shield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 2.8v5.6c0 4.2-2.8 7.7-7 9.6-4.2-1.9-7-5.4-7-9.6V5.8L12 3z" />
    <path d="M8.8 12.2l2.3 2.3 4.2-4.6" />
  </Base>
);

export const Lock = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" />
    <circle cx="12" cy="15.2" r="1.2" />
  </Base>
);

export const Route = (p: IconProps) => (
  <Base {...p}>
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M8 18h7.5a3 3 0 000-6h-7a3 3 0 010-6H16" />
  </Base>
);

export const Tag = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.5 12.2V4.5a1 1 0 011-1h7.7a1 1 0 01.7.3l7.3 7.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0l-7.2-7.2a1 1 0 01-.7-.7z" />
    <circle cx="8.5" cy="8.5" r="1.3" />
  </Base>
);

export const Alert = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5l9 15.5H3L12 3.5z" />
    <path d="M12 10v4M12 16.8v.1" />
  </Base>
);

export const Users = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5" />
    <path d="M16 5.6a3 3 0 010 5.8M18 14.8c1.7.6 2.8 2 3 4.2" />
  </Base>
);

export const Bolt = (p: IconProps) => (
  <Base {...p}><path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z" /></Base>
);

export const Lockup = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.2l2.4 2.4 4.6-5" />
  </Base>
);
