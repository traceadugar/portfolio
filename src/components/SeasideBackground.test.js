import React from 'react';
import { act, fireEvent, render, cleanup } from '@testing-library/react';
import SeasideBackground from './SeasideBackground';

let callbacks;
let clock;
let context;
let motionListeners;

beforeEach(() => {
  clock = 0;
  callbacks = new Map();
  motionListeners = [];
  let id = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => clock);
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callbacks.set(++id, callback); return id;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(key => callbacks.delete(key));
  window.matchMedia = jest.fn(query => ({
    matches: false,
    addEventListener: (event, callback) => { if (query.includes('reduced-motion')) motionListeners.push(callback); },
    removeEventListener: jest.fn(),
  }));
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  context = { globalAlpha: 1, drawImage: jest.fn() };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function () {
    Object.defineProperty(this, 'paused', { configurable: true, value: false });
    return Promise.resolve();
  });
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function () {
    Object.defineProperty(this, 'paused', { configurable: true, value: true });
  });
});

afterEach(() => { cleanup(); jest.restoreAllMocks(); });

function advance(milliseconds) {
  act(() => {
    clock += milliseconds;
    const pending = [...callbacks.values()];
    callbacks.clear();
    pending.forEach(callback => callback(clock));
  });
}

function loadVideo(container) {
  const video = container.querySelector('video');
  Object.defineProperties(video, {
    readyState: { configurable: true, value: 2 },
    videoWidth: { configurable: true, value: 1920 },
    videoHeight: { configurable: true, value: 540 },
    currentTime: { configurable: true, writable: true, value: 1.6 },
  });
  fireEvent.loadedData(video);
  return video;
}

test('theme fades sample both halves of one video without restarting its clock', () => {
  const { container, rerender } = render(<SeasideBackground theme="light" paused={false} />);
  const video = loadVideo(container);
  const source = video.src;
  advance(80);
  const playCalls = video.play.mock.calls.length;
  const pauseCalls = video.pause.mock.calls.length;
  rerender(<SeasideBackground theme="dark" paused={false} />);
  context.drawImage.mockClear();
  advance(600);
  expect(context.drawImage.mock.calls.map(call => call.slice(0, 5))).toEqual([
    [video, 0, 0, 960, 540], [video, 960, 0, 960, 540],
  ]);
  expect(container.querySelector('video')).toBe(video);
  expect(video.src).toBe(source);
  expect(video.currentTime).toBe(1.6);
  expect(video.play.mock.calls).toHaveLength(playCalls);
  expect(video.pause.mock.calls).toHaveLength(pauseCalls);
  // One scalar colors the page and blends the two halves at the same instant.
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBeCloseTo(.5);
  expect(document.body.style.getPropertyValue('--surface')).toBe('rgb(142.5, 142, 158)');
  expect(container.querySelector('.seaside-background')).toHaveAttribute('data-ready', 'true');
});

test('pausing freezes playback while a theme fade can still finish', () => {
  const { container, rerender } = render(<SeasideBackground theme="light" paused={false} />);
  const video = loadVideo(container);
  advance(80);
  rerender(<SeasideBackground theme="dark" paused={true} />);
  expect(video.paused).toBe(true);
  advance(1200);
  expect(video.currentTime).toBe(1.6);
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBe(1);
  expect(context.drawImage.mock.calls.at(-1).slice(0, 5)).toEqual([video, 960, 0, 960, 540]);
  expect(callbacks.size).toBe(0);
});

test('reversing a fade keeps the current lighting and finishes back at day', () => {
  const { container, rerender } = render(<SeasideBackground theme="light" paused={false} />);
  loadVideo(container);
  const alphas = [];
  context.drawImage.mockImplementation(() => alphas.push(context.globalAlpha));
  advance(80);
  rerender(<SeasideBackground theme="dark" paused={false} />);
  advance(600);
  expect(alphas.at(-1)).toBeCloseTo(.5);
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBeCloseTo(alphas.at(-1));
  rerender(<SeasideBackground theme="light" paused={false} />);
  advance(1);
  expect(alphas.at(-1)).toBeCloseTo(.5);
  advance(1199);
  expect(alphas.at(-1)).toBe(1);
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBe(0);
});

test('reduced motion unloads the moving scene and media errors leave the poster visible', () => {
  const { container, rerender } = render(<SeasideBackground theme="dark" paused={false} />);
  const video = loadVideo(container);
  advance(80);
  fireEvent.error(video);
  advance(80);
  expect(container.querySelector('.seaside-background')).toHaveAttribute('data-ready', 'false');
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBe(1);
  rerender(<SeasideBackground theme="light" paused={false} />);
  advance(600);
  expect(container.querySelector('.seaside-background')).toHaveAttribute('data-ready', 'false');
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBeCloseTo(.5);
  advance(600);
  expect(callbacks.size).toBe(0);
  act(() => motionListeners.forEach(listener => listener({ matches: true })));
  expect(container.querySelector('video')).toBeNull();
  expect(callbacks.size).toBe(0);
});

test('an initial reduced-motion preference uses posters without starting a decoder', () => {
  window.matchMedia.mockImplementation(query => ({
    matches: query.includes('reduced-motion'),
    addEventListener: jest.fn(), removeEventListener: jest.fn(),
  }));
  const { container } = render(<SeasideBackground theme="dark" paused={false} />);
  expect(container.querySelector('video')).toBeNull();
  expect(container.querySelector('.seaside-poster-day')).toBeInTheDocument();
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBe(1);
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
});

test('an unavailable canvas still fades the interface and poster on the shared clock', () => {
  HTMLCanvasElement.prototype.getContext.mockReturnValue(null);
  const { container, rerender } = render(<SeasideBackground theme="light" paused={false} />);
  advance(80);
  rerender(<SeasideBackground theme="dark" paused={false} />);
  advance(600);
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBeCloseTo(.5);
  advance(600);
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBe(1);
  expect(container.querySelector('.seaside-background')).toHaveAttribute('data-ready', 'false');
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  expect(callbacks.size).toBe(0);
});

test('the lighthouse accumulates the source clock across video loops and freezes through pause and theme fades', () => {
  const onFrame = jest.fn();
  const { container, rerender } = render(<SeasideBackground theme="dark" paused={false} onFrame={onFrame} />);
  const video = loadVideo(container);
  advance(80);
  expect(onFrame.mock.calls.at(-1)[0]).toMatchObject({ seconds: 0, active: true });
  for (let loop = 0; loop < 5; loop += 1) {
    video.currentTime = 3.92;
    advance(2320);
    video.currentTime = .08;
    advance(160);
  }
  const seconds = onFrame.mock.calls.at(-1)[0].seconds;
  expect(seconds).toBeCloseTo(18.48);
  rerender(<SeasideBackground theme="light" paused={true} onFrame={onFrame} />);
  advance(600);
  expect(onFrame.mock.calls.at(-1)[0].seconds).toBe(seconds);
  advance(600);
  expect(onFrame.mock.calls.at(-1)[0].seconds).toBe(seconds);
  expect(callbacks.size).toBe(0);
  expect(Number(document.body.style.getPropertyValue('--theme-blend'))).toBe(0);
  fireEvent.error(video);
  expect(onFrame.mock.calls.at(-1)[0].active).toBe(false);
});

test('a hidden document freezes the same lighthouse phase and resumes without a time jump', () => {
  const onFrame = jest.fn();
  const { container } = render(<SeasideBackground theme="dark" paused={false} onFrame={onFrame} />);
  const video = loadVideo(container);
  advance(80);
  video.currentTime = 2;
  advance(400);
  const seconds = onFrame.mock.calls.at(-1)[0].seconds;
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  fireEvent(document, new Event('visibilitychange'));
  advance(8000);
  expect(onFrame.mock.calls.at(-1)[0].seconds).toBe(seconds);
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  fireEvent(document, new Event('visibilitychange'));
  advance(16);
  expect(onFrame.mock.calls.at(-1)[0].seconds).toBe(seconds);
  video.currentTime = 2.08;
  advance(80);
  expect(onFrame.mock.calls.at(-1)[0].seconds).toBeCloseTo(seconds + .08);
});
