import React from 'react';

// One cached SVG sprite replaces two external stylesheets and full icon fonts.
// Icons are decorative; their adjacent text or parent link supplies the name.
export default function Icon({ name, className = '' }) {
  return <svg className={`icon ${className}`} aria-hidden="true" focusable="false">
    <use href={`/images/icons/ui.svg#${name}`} />
  </svg>;
}
