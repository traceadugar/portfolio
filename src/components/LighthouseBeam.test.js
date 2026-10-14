import React, { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import LighthouseBeam, { LighthouseText, coneClip, lighthouseCone } from './LighthouseBeam';

test('the beam keeps the actual scene lamp position through desktop and mobile cover crops', () => {
  const desktop = lighthouseCone(1440, 540, 0);
  expect(desktop.origin.x).toBeCloseTo(1293.75);
  expect(desktop.origin.y).toBeCloseTo(-77.625);
  const mobile = lighthouseCone(390, 400, 0);
  expect(mobile.origin.x).toBeCloseTo(539.344);
  expect(mobile.origin.y).toBeCloseTo(41.667);
  // Offscreen lamp positions are deliberate: the scene's framing is preserved.
  expect(mobile.origin.x).toBeGreaterThan(390);
});

test('one full revolution closes exactly and text clipping translates the same cone', () => {
  const start = lighthouseCone(1024, 540, 0);
  expect(lighthouseCone(1024, 540, 16)).toEqual(start);
  expect(lighthouseCone(1024, 540, 4).points).not.toEqual(start.points);
  expect(coneClip([{ x: 20, y: 30 }, { x: 40, y: 50 }, { x: 60, y: 70 }], 10, 20))
    .toBe('polygon(10.000px 10.000px, 30.000px 30.000px, 50.000px 50.000px)');
});

test('decorative inverted text leaves one accessible heading and shares the visible core geometry', () => {
  const ref = createRef();
  const { container } = render(<header className="site-header">
    <LighthouseBeam ref={ref} textKey="Trace Dugar" />
    <LighthouseText as="h1">Trace Dugar</LighthouseText>
  </header>);
  const heading = screen.getByRole('heading', { name: 'Trace Dugar' });
  expect(heading.querySelector('.lighthouse-lit-text')).toHaveAttribute('aria-hidden', 'true');
  act(() => ref.current.update({ seconds: 2, width: 1024, height: 540, blend: 1, active: true }));
  const path = container.querySelector('.lighthouse-beam-core').getAttribute('d');
  expect(container.querySelector('.lighthouse-beam-halo').getAttribute('d')).not.toBe(path);
  expect(heading.querySelector('.lighthouse-lit-text').style.getPropertyValue('--lighthouse-clip'))
    .toBe(coneClip(lighthouseCone(1024, 540, 2).points));
  act(() => ref.current.update({ active: false }));
  expect(container.querySelector('header')).toHaveAttribute('data-lighthouse-active', 'false');
});

test('translated text reflows at the frozen phase while the scene is paused', () => {
  const ref = createRef();
  let left = 40;
  const bounds = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
    return { left: this.classList.contains('lighthouse-text') ? left : 0, top: 0, width: 0, height: 0 };
  });
  const banner = text => <header className="site-header">
    <LighthouseBeam ref={ref} textKey={text} />
    <LighthouseText as="h1">{text}</LighthouseText>
  </header>;
  const { container, rerender } = render(banner('English heading'));
  act(() => ref.current.update({ seconds: 2, width: 1024, height: 540, blend: 1, active: true }));
  const path = container.querySelector('.lighthouse-beam-core').getAttribute('d');
  left = 80;
  rerender(banner('日本語の見出し'));
  expect(screen.getByRole('heading', { name: '日本語の見出し' }).querySelector('.lighthouse-lit-text').style.getPropertyValue('--lighthouse-clip'))
    .toBe(coneClip(lighthouseCone(1024, 540, 2).points, 80, 0));
  expect(container.querySelector('.lighthouse-beam-core')).toHaveAttribute('d', path);
  bounds.mockRestore();
});

test('theme fading never crossfades the lit text through a low-contrast foreground/backdrop pair', () => {
  const ref = createRef();
  const { container } = render(<header className="site-header">
    <LighthouseBeam ref={ref} textKey="Trace Dugar" />
    <LighthouseText as="h1">Trace Dugar</LighthouseText>
  </header>);
  const frame = { seconds: 0, width: 1024, height: 540, active: true };
  act(() => ref.current.update({ ...frame, blend: .5 }));
  expect(container.querySelector('header')).toHaveAttribute('data-lighthouse-lit', 'false');
  act(() => ref.current.update({ ...frame, blend: 1 }));
  expect(container.querySelector('header')).toHaveAttribute('data-lighthouse-lit', 'true');
  act(() => ref.current.update({ ...frame, blend: 0 }));
  expect(container.querySelector('header')).toHaveAttribute('data-lighthouse-lit', 'false');
});
