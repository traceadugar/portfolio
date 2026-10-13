import React from 'react';

// Original line icons echo the rounded details of the seaside illustration.
// Technology and social marks remain in the small, locally cached sprite.
const shoreIcons = {
  'shore-home': <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h5v-6h4v6h5V9" /></>,
  'shore-person': <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2.5a7 7 0 0 1 14 0V21" /></>,
  'shore-code': <><path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16" /></>,
  'shore-arrow': <><path d="M4 12h15m-6-6 6 6-6 6" /></>,
  'shore-arrow-up': <><path d="M12 20V5m-6 6 6-6 6 6" /></>,
  'shore-sun': <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19" /></>,
  'shore-moon': <><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" /></>,
  'shore-pause': <><rect x="6" y="4" width="4" height="16" rx="1.5" /><rect x="14" y="4" width="4" height="16" rx="1.5" /></>,
  'shore-play': <><path d="M8 4.5v15l12-7.5L8 4.5Z" /></>,
  'shore-briefcase': <><rect x="3" y="7" width="18" height="14" rx="2.5" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12c4 4 14 4 18 0" /><path d="M10 13v3h4v-3" /></>,
  'shore-book': <><path d="M12 6c-3-2-6-3-10-2v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-4-1-7 0-10 2Zm0 0v15M5 8l4 1M5 12l4 1m6-4 4-1m-4 5 4-1" /></>,
  'shore-compass': <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" /><path d="M12 3v2m0 14v2M3 12h2m14 0h2" /></>,
  'shore-envelope': <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3 7 9 7 9-7" /></>,
  'shore-chevron-left': <path d="m15 5-7 7 7 7" />,
  'shore-chevron-right': <path d="m9 5 7 7-7 7" />,
  'shore-close': <path d="m6 6 12 12M18 6 6 18" />,
  'shore-anchor': <><circle cx="12" cy="5" r="2.5" /><path d="M12 7.5V21M8 11h8M3 13v3c0 3 4 5 9 5s9-2 9-5v-3m-18 0 3 3m15-3-3 3" /></>,
  'shore-shell': <><path d="M4 15a9 9 0 1 1 16 0l-5.5 6h-5L4 15Z" /><path d="m5 7 7 11m0-15v15m7-11-7 11M3 12l9 6 9-6m-13 8h8" /></>,
  'shore-network': <><rect x="8" y="2" width="8" height="5" rx="1.5" /><rect x="2" y="17" width="8" height="5" rx="1.5" /><rect x="14" y="17" width="8" height="5" rx="1.5" /><path d="M12 7v5M6 17v-5h12v5" /></>,
  'shore-shield': <><path d="m12 2 8 3v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V5l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
};

// All icons are decorative; adjacent text or the parent control supplies a name.
export default function Icon({ name, className = '' }) {
  if (shoreIcons[name]) return <svg className={`icon shore-icon ${className}`} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <g fill="none">{shoreIcons[name]}</g>
  </svg>;
  return <svg className={`icon ${className}`} aria-hidden="true" focusable="false">
    <use href={`/images/icons/ui.svg#${name}`} />
  </svg>;
}
