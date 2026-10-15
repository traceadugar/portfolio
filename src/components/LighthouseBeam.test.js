import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';
import LighthouseBeam, { seasideBeacon, seasideLightCover } from './LighthouseBeam';

test('the light follows the real lamp through desktop and mobile cover crops', () => {
  const desktop = seasideLightCover(1440, 540);
  expect(desktop.x + 1150 * desktop.scale).toBeCloseTo(1293.75);
  expect(desktop.y + 75 * desktop.scale).toBeCloseTo(-77.625);
  const mobile = seasideLightCover(390, 400);
  expect(mobile.x + 1150 * mobile.scale).toBeCloseTo(539.344);
  expect(mobile.y + 75 * mobile.scale).toBeCloseTo(41.667);
});

test('the far return is shorter, narrower, dimmer, and the full rotation closes', () => {
  const near = seasideBeacon(2);
  const far = seasideBeacon(14);
  expect(far.reach).toBeLessThan(near.reach);
  expect(far.halfWidth).toBeLessThan(near.halfWidth);
  expect(far.farOpacity).toBeLessThan(near.nearOpacity);
  expect(far.end.x).toBeGreaterThan(near.end.x);
  expect(far.end.x).toBeGreaterThan(700);
  expect(far.end.x).toBeLessThan(1100);
  expect(seasideBeacon(16)).toEqual(seasideBeacon(0));
});

test('light stays in the upper background throughout the loop', () => {
  for (let seconds = 0; seconds < 16; seconds += .1) {
    const frame = seasideBeacon(seconds);
    expect(Math.max(...frame.halo.map(point => point.y))).toBeLessThan(190);
    expect(frame.nearOpacity).toBeGreaterThanOrEqual(0);
    expect(frame.farOpacity).toBeGreaterThanOrEqual(0);
  }
});

test('foreground occlusion encloses every filtered layer and the far pass also has a hillside mask', () => {
  const ref = createRef();
  const { container } = render(<header className="site-header"><LighthouseBeam ref={ref} /></header>);
  act(() => ref.current.update({ seconds: 2, width: 1024, height: 540, active: true }));
  const near = container.querySelector('[data-light-pass="near"]');
  const far = container.querySelector('[data-light-pass="far"]');
  expect(near.parentElement.getAttribute('mask')).toMatch(/foreground/);
  expect(far.parentElement).toBe(near.parentElement);
  expect(far.getAttribute('mask')).toMatch(/hill/);
  expect(near.querySelectorAll('use[filter]')).toHaveLength(2);
  expect(container.querySelectorAll('filter')).toHaveLength(2);
  for (const filter of container.querySelectorAll('filter')) {
    expect(filter).toHaveAttribute('filterUnits', 'userSpaceOnUse');
    expect(filter).toHaveAttribute('width', '1280');
    expect(filter).toHaveAttribute('height', '190');
  }
  expect(container.querySelectorAll('.lighthouse-lit-text')).toHaveLength(0);
  act(() => ref.current.update({ active: false }));
  expect(container.querySelector('header')).toHaveAttribute('data-lighthouse-active', 'false');
});

test('a brief lantern glint catches only the front-facing phase and closes at the existing loop seam', () => {
  expect(seasideBeacon(4).glint).toBe(1);
  expect(seasideBeacon(3).glint).toBeLessThan(.03);
  expect(seasideBeacon(5).glint).toBeLessThan(.03);
  expect(seasideBeacon(12).glint).toBe(0);
  expect(seasideBeacon(0).glint).toBe(seasideBeacon(16).glint);
});

test('the emitter stays inside the tiny source lamp while scattered glint remains foreground-masked', () => {
  const ref = createRef();
  const { container } = render(<header className="site-header"><LighthouseBeam ref={ref} /></header>);
  act(() => ref.current.update({ seconds: 4, width: 1024, height: 540, active: true }));
  const emitter = container.querySelector('[data-light-glint="window"]');
  const air = container.querySelector('[data-light-glint="air"]');
  expect(emitter).toHaveAttribute('cx', '1150');
  expect(emitter).toHaveAttribute('cy', '75');
  expect(emitter).toHaveAttribute('r', '3');
  expect(emitter).toHaveAttribute('opacity', '0.680000');
  expect(emitter).not.toHaveAttribute('filter');
  expect(air.parentElement.getAttribute('mask')).toMatch(/foreground/);
  expect(air.querySelector('circle')).toHaveAttribute('filter');
  act(() => ref.current.update({ seconds: 12, width: 1024, height: 540, active: true }));
  expect(emitter).toHaveAttribute('opacity', '0.000000');
  expect(air).toHaveAttribute('opacity', '0.000000');
});
