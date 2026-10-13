import { applyThemeBlend, DAY, DUSK } from './themePalette';

const channels = value => value.match(/\d+(?:\.\d+)?/g).slice(0, 3).map(Number);
const luminance = rgb => rgb.map(value => {
  const scaled = value / 255;
  return scaled <= .04045 ? scaled / 12.92 : ((scaled + .055) / 1.055) ** 2.4;
}).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
const contrast = (one, two) => {
  const a = luminance(one); const b = luminance(two);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};
const read = name => channels(document.body.style.getPropertyValue(`--${name}`));
const hexChannels = hex => hex.match(/[\da-f]{2}/gi).map(value => parseInt(value, 16));

afterEach(() => { document.body.style.cssText = ''; });

test('sampled seaside endpoints remain exact', () => {
  for (const [blend, palette] of [[0, DAY], [1, DUSK]]) {
    applyThemeBlend(blend);
    for (const name of ['page', 'surface', 'surface-alt', 'wash', 'edge', 'hero-light', 'hero-gold', 'hero-ocean']) {
      expect(read(name)).toEqual(hexChannels(palette[name]));
    }
    expect(read('accent-fill')).toEqual(hexChannels(palette.accent));
    expect(read('accent-ink')).toEqual(hexChannels(palette['accent-ink']));
  }
});

test('text, focus outlines, and button labels stay readable across the complete fade', () => {
  for (let step = 0; step <= 1200; step += 1) {
    applyThemeBlend(step / 1200);
    for (const group of ['page', 'surface', 'surface-alt', 'wash']) {
      for (const name of ['ink', 'muted', 'accent', 'secondary', 'border', 'focus']) {
        const required = name === 'border' || name === 'focus' ? 3 : 4.5;
        expect(contrast(read(`${group}-${name}`), read(group))).toBeGreaterThanOrEqual(required);
      }
    }
    const fill = read('accent-fill');
    const label = read('accent-ink');
    const highlight = read('highlight-rgb');
    const sheen = Number(document.body.style.getPropertyValue('--button-sheen-opacity'));
    const top = fill.map((value, index) => value + (highlight[index] - value) * sheen);
    expect(contrast(label, fill)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(label, top)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(read('secondary-ink'), read('secondary-fill'))).toBeGreaterThanOrEqual(4.5);
  }
});

test('rapid reversals return to the same palette without depending on earlier calls', () => {
  applyThemeBlend(.37);
  const original = document.body.style.cssText;
  for (const blend of [1, .6, 0, .8, .2, .37]) applyThemeBlend(blend);
  expect(document.body.style.cssText).toBe(original);
});
