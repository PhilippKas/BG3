import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const Sigil = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" aria-hidden {...p}>
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--gold)" strokeWidth="2" />
    <path d="M16 5 L19 13 L27 16 L19 19 L16 27 L13 19 L5 16 L13 13 Z" fill="var(--gold)" />
  </svg>
);

export const Star = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />
  </svg>
);

export const Ban = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.6 5.6l12.8 12.8" />
  </svg>
);

export const Eye = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Sun = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const Moon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const Dice = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M12 2l8.7 5v10L12 22l-8.7-5V7z" />
    <path d="M12 22V12M12 12l8.7-5M12 12L3.3 7" />
    <circle cx="12" cy="7" r="0.8" fill="currentColor" />
    <circle cx="7.5" cy="13.5" r="0.8" fill="currentColor" />
    <circle cx="16.5" cy="13.5" r="0.8" fill="currentColor" />
  </svg>
);

export const Save = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M8 3v5h7V3M8 21v-7h8v7" />
  </svg>
);
