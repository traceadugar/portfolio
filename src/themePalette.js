// Endpoints are sampled seaside GIF colors and their documented derivatives.
export const DAY = {
  page: '#fff8e8', surface: '#fffcf6', 'surface-alt': '#fff5e1', wash: '#dff5f9',
  ink: '#081823', muted: '#133b58', accent: '#16636f', 'accent-ink': '#fffcf6',
  secondary: '#834d37', 'secondary-ink': '#fffcf6', border: '#82765b',
  edge: '#e5d0a1', focus: '#114c56', highlight: '#fffcf6',
  'hero-light': '#fffcf6', 'hero-gold': '#f6dcaf',
  'hero-ink': '#081823', 'hero-ocean': '#2f93db',
};
export const DUSK = {
  page: '#051026', surface: '#1e2046', 'surface-alt': '#292b60', wash: '#0c275f',
  ink: '#f2e5e3', muted: '#cebdda', accent: '#fce0a2', 'accent-ink': '#051026',
  secondary: '#cebdda', 'secondary-ink': '#1e2046', border: '#af94c3',
  edge: '#4a4fae', focus: '#fce0a2', highlight: '#f2e5e3',
  'hero-light': '#f2e5e3', 'hero-gold': '#fce0a2',
  'hero-ink': '#051026', 'hero-ocean': '#113888',
};

const groups = ['page', 'surface', 'surface-alt', 'wash'];
const foregrounds = ['ink', 'muted', 'accent', 'secondary', 'border', 'focus'];
const rgb = hex => hex.match(/[\da-f]{2}/gi).map(value => parseInt(value, 16));
const mix = (a, b, blend) => a.map((value, index) => value + (b[index] - value) * blend);
const channels = color => color.map(value => Number(value.toFixed(3))).join(', ');
const css = color => `rgb(${channels(color)})`;
const day = Object.fromEntries(Object.entries(DAY).map(([name, color]) => [name, rgb(color)]));
const dusk = Object.fromEntries(Object.entries(DUSK).map(([name, color]) => [name, rgb(color)]));

function luminance(color) {
  const linear = color.map(value => {
    const channel = value / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function contrast(a, b) {
  const light = Math.max(luminance(a), luminance(b));
  const dark = Math.min(luminance(a), luminance(b));
  return (light + .05) / (dark + .05);
}
const minimumContrast = (color, backgrounds) => Math.min(...backgrounds.map(background => contrast(color, background)));
const extremeFor = background => contrast([0, 0, 0], background) >= contrast([255, 255, 255], background)
  ? [0, 0, 0] : [255, 255, 255];

// Retain the interpolated hue when readable. A light/dark polarity switch is
// necessary during a luminance crossover; smoothly tweening opposing text and
// surfaces would make their colors equal and briefly hide the text.
function readable(preferred, backgrounds, target, extreme = extremeFor(backgrounds[0])) {
  if (minimumContrast(preferred, backgrounds) >= target) return preferred;
  let low = 0;
  let high = 1;
  for (let step = 0; step < 20; step += 1) {
    const middle = (low + high) / 2;
    if (minimumContrast(mix(preferred, extreme, middle), backgrounds) >= target) high = middle;
    else low = middle;
  }
  return mix(preferred, extreme, high);
}

// The controller supplies the SAME blend value used to paint the seaside
// canvas. No CSS color transitions should add a second timing curve.
export function applyThemeBlend(value, target = document.body) {
  const blend = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  const palette = Object.fromEntries(Object.keys(DAY).map(name => [name, mix(day[name], dusk[name], blend)]));
  const set = (name, color) => target.style.setProperty(`--${name}`, color);
  set('theme-blend', blend.toFixed(6));
  for (const name of [...groups, 'edge', 'hero-light', 'hero-gold', 'hero-ocean']) set(name, css(palette[name]));
  set('hero-rgb', channels(palette['hero-ink']));
  set('highlight-rgb', channels(palette.highlight));
  set('shadow', `rgba(${channels(mix(day.ink, dusk.page, blend))}, ${.09 + .23 * blend})`);
  set('button-shadow', `rgba(${channels(mix(day.ink, dusk.page, blend))}, ${.26 + .24 * blend})`);

  for (const group of groups) {
    for (const name of foregrounds) {
      const required = name === 'border' || name === 'focus' ? 3.05 : 4.57;
      set(`${group}-${name}`, css(readable(palette[name], [palette[group]], required)));
    }
  }

  // The button fill is decorative motion; its label follows the fill's own
  // contrast crossover. Reduce its highlight smoothly when a sheen would span
  // both sides of that crossover and leave neither light nor dark text readable.
  let sheen = .15;
  const extreme = extremeFor(palette.accent);
  if (minimumContrast(extreme, [palette.accent, mix(palette.accent, palette.highlight, sheen)]) < 4.57) {
    let low = 0;
    let high = sheen;
    for (let step = 0; step < 20; step += 1) {
      const middle = (low + high) / 2;
      if (minimumContrast(extreme, [palette.accent, mix(palette.accent, palette.highlight, middle)]) >= 4.57) low = middle;
      else high = middle;
    }
    sheen = low;
  }
  set('button-sheen-opacity', sheen.toFixed(6));
  set('accent-fill', css(palette.accent));
  set('accent-ink', css(readable(palette['accent-ink'], [palette.accent, mix(palette.accent, palette.highlight, sheen)], 4.57, extreme)));
  set('secondary-fill', css(palette.secondary));
  set('secondary-ink', css(readable(palette['secondary-ink'], [palette.secondary], 4.57)));
}
