import React, { useEffect, useRef, useState } from 'react';
import { applyThemeBlend } from '../themePalette';

const FADE_MS = 1200;
const FRAME_SECONDS = .08;
const mediaRoot = `${process.env.PUBLIC_URL}/images/backgrounds`;

export default function SeasideBackground({ theme, paused, onFrame }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const preferencesRef = useRef({ theme, paused });
  preferencesRef.current = { theme, paused };
  const [reducedMotion, setReducedMotion] = useState(() =>
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches));
  const [mobile] = useState(() => Boolean(window.matchMedia?.('(max-width: 500px)').matches));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!preference) return undefined;
    const change = event => setReducedMotion(event.matches);
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    setReady(false);
    if (reducedMotion) {
      applyThemeBlend(preferencesRef.current.theme === 'dark' ? 1 : 0);
      onFrameRef.current?.({ active: false });
      return undefined;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    let context;
    try { context = canvas.getContext('2d', { alpha: false }); } catch { context = null; }

    // Both lighting variants are packed into each video frame. A theme change
    // blends its two halves without changing the source or playback position.
    let blend = preferencesRef.current.theme === 'dark' ? 1 : 0;
    let startBlend = blend;
    let targetBlend = blend;
    let fadeStarted = 0;
    let raf = 0;
    let disposed = false;
    let failed = !context;
    let lastFrame = -1;
    let lastBlend = -1;
    let shown = false;
    let appliedBlend = blend;
    let sceneSeconds = 0;
    let lastSceneTime = null;
    applyThemeBlend(blend);

    const paint = now => {
      raf = 0;
      if (disposed) return;
      // A cumulative clock survives the source video's four-second wrap. It
      // advances only while that same scene plays, so pause and hidden tabs
      // freeze the lighthouse without introducing another animation loop.
      const moving = !failed && !video.paused && !document.hidden && !preferencesRef.current.paused;
      if (moving && lastSceneTime !== null) {
        const delta = video.currentTime - lastSceneTime;
        const duration = Number.isFinite(video.duration) ? video.duration : 4;
        sceneSeconds += Math.max(0, delta < 0 ? delta + duration : delta);
      }
      lastSceneTime = video.currentTime;
      const progress = Math.min(1, Math.max(0, (now - fadeStarted) / FADE_MS));
      blend = startBlend + (targetBlend - startBlend) * (1 - Math.cos(Math.PI * progress)) / 2;
      // The interface and both poster/video lighting variants use this exact
      // blend and clock. Stable waves do not rewrite the page's color tokens.
      if (appliedBlend !== blend) { applyThemeBlend(blend); appliedBlend = blend; }
      const frame = Math.floor(video.currentTime / FRAME_SECONDS);
      if (!failed && video.readyState >= 2 && video.videoWidth && video.videoHeight &&
          (lastFrame !== frame || lastBlend !== blend)) {
        const sourceWidth = video.videoWidth / 2;
        const scale = Math.max(canvas.width / sourceWidth, canvas.height / video.videoHeight);
        const width = sourceWidth * scale;
        const height = video.videoHeight * scale;
        const narrow = containerRef.current.clientWidth <= 500;
        const x = (canvas.width - width) * (narrow ? .31 : .5);
        const y = (canvas.height - height) * (narrow ? .5 : .6);
        try {
          context.globalAlpha = 1;
          context.drawImage(video, 0, 0, sourceWidth, video.videoHeight, x, y, width, height);
          if (blend > 0) {
            context.globalAlpha = blend;
            context.drawImage(video, sourceWidth, 0, sourceWidth, video.videoHeight, x, y, width, height);
            context.globalAlpha = 1;
          }
        } catch { fail(); return; }
        lastFrame = frame;
        lastBlend = blend;
        if (!shown) { shown = true; setReady(true); }
      }
      onFrameRef.current?.({
        seconds: sceneSeconds,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        blend,
        active: shown && !failed,
      });
      if ((!failed && !video.paused) || blend !== targetBlend) schedule();
    };
    const schedule = () => { if (!disposed && !raf) raf = requestAnimationFrame(paint); };
    const resize = () => {
      const { clientWidth, clientHeight } = containerRef.current;
      if (!clientWidth || !clientHeight) return;
      canvas.width = Math.min(960, Math.round(clientWidth * Math.min(window.devicePixelRatio || 1, 2)));
      canvas.height = Math.round(canvas.width * clientHeight / clientWidth);
      lastFrame = -1;
      schedule();
    };
    const fail = () => {
      failed = true;
      cancelAnimationFrame(raf);
      raf = 0;
      video.pause();
      shown = false;
      lastSceneTime = null;
      setReady(false);
      onFrameRef.current?.({ active: false });
      if (blend !== targetBlend) schedule();
    };
    const playing = () => { failed = !context; lastFrame = -1; schedule(); };
    const updatePlayback = () => {
      if (preferencesRef.current.paused || document.hidden || !context) video.pause();
      else {
        const playback = video.play();
        if (playback) playback.catch(() => {
          if (!disposed && !preferencesRef.current.paused && !document.hidden) fail();
        });
      }
      schedule();
    };
    controlsRef.current = {
      setTheme(nextTheme) {
        startBlend = blend;
        targetBlend = nextTheme === 'dark' ? 1 : 0;
        fadeStarted = performance.now();
        schedule();
      },
      updatePlayback,
    };
    const observer = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (observer) observer.observe(containerRef.current);
    else window.addEventListener('resize', resize);
    video.addEventListener('loadeddata', updatePlayback);
    video.addEventListener('playing', playing);
    video.addEventListener('seeked', schedule);
    video.addEventListener('error', fail);
    document.addEventListener('visibilitychange', updatePlayback);
    resize();
    updatePlayback();
    return () => {
      disposed = true;
      controlsRef.current = null;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      video.removeEventListener('loadeddata', updatePlayback);
      video.removeEventListener('playing', playing);
      video.removeEventListener('seeked', schedule);
      video.removeEventListener('error', fail);
      document.removeEventListener('visibilitychange', updatePlayback);
      video.pause();
      onFrameRef.current?.({ active: false });
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) applyThemeBlend(theme === 'dark' ? 1 : 0);
    else controlsRef.current?.setTheme(theme);
  }, [theme, reducedMotion]);
  useEffect(() => { controlsRef.current?.updatePlayback(); }, [paused]);

  return <div ref={containerRef} className="seaside-background" data-ready={ready} aria-hidden="true">
    <div className="seaside-poster seaside-poster-day"
      style={{ backgroundImage: `url(${mediaRoot}/seaside-town-poster.webp)` }} />
    <div className="seaside-poster seaside-poster-dusk"
      style={{ backgroundImage: `url(${mediaRoot}/seaside-town-dusk-poster.webp)` }} />
    {!reducedMotion && <video ref={videoRef} className="seaside-video" muted loop playsInline preload="auto"
      src={`${mediaRoot}/seaside-town-synced${mobile ? '-mobile' : ''}.mp4`} />}
    <canvas ref={canvasRef} className="seaside-canvas" />
  </div>;
}
