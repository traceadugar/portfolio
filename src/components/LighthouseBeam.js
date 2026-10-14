import React, { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const LOOP_SECONDS = 16;
const CORE_ANGLE = 4.5 * Math.PI / 180;
const HALO_ANGLE = 13 * Math.PI / 180;
const DEPTH_SCALE = .62;

// The lamp is measured in the original 1280×720 seaside image. Match the
// scene's cover crop, including its mobile focus, even when the lamp is offscreen.
export function lighthouseCone(width, height, seconds) {
  const scale = Math.max(width / 1280, height / 720);
  const narrow = width <= 500;
  const origin = {
    x: (width - 1280 * scale) * (narrow ? .31 : .5) + 1150 * scale,
    y: (height - 720 * scale) * (narrow ? .5 : .6) + 75 * scale,
  };
  const angle = (110 + (seconds % LOOP_SECONDS) / LOOP_SECONDS * 360) * Math.PI / 180;
  const reach = Math.hypot(width, height) + Math.hypot(origin.x, origin.y) + 1;
  // Project a circular rotation into the scene's depth. A shallow ellipse and
  // dimming on the far side suggest a rotating beacon rather than a clock hand.
  const point = radians => ({ x: origin.x + Math.cos(radians) * reach, y: origin.y + Math.sin(radians) * reach * DEPTH_SCALE });
  const triangle = halfAngle => [origin, point(angle - halfAngle), point(angle + halfAngle)];
  const strength = Math.min(1, Math.max(0, (Math.sin(angle) + .22) / .32));
  return { origin, reach, strength, points: triangle(CORE_ANGLE), haloPoints: triangle(HALO_ANGLE) };
}

export function coneClip(points, left = 0, top = 0) {
  return `polygon(${points.map(point => `${(point.x - left).toFixed(3)}px ${(point.y - top).toFixed(3)}px`).join(', ')})`;
}

export function LighthouseText({ as: Tag = 'span', className = '', children }) {
  return <Tag className={`lighthouse-text ${className}`}>
    <span>{children}</span>
    <span className="lighthouse-lit-text" aria-hidden="true">{children}</span>
  </Tag>;
}

const LighthouseBeam = forwardRef(function LighthouseBeam({ textKey }, ref) {
  const svgRef = useRef(null);
  const coreRef = useRef(null);
  const haloRef = useRef(null);
  const lampRef = useRef(null);
  const filterRef = useRef(null);
  const coreGradientRef = useRef(null);
  const haloGradientRef = useRef(null);
  const layoutRef = useRef(null);
  const lastFrameRef = useRef(null);
  const paintRef = useRef(null);
  const haloId = `lighthouse-halo-${useId().replace(/:/g, '')}`;

  useLayoutEffect(() => {
    const invalidate = () => {
      layoutRef.current = null;
      if (lastFrameRef.current) paintRef.current?.(lastFrameRef.current);
    };
    invalidate();
    const header = svgRef.current?.closest('.site-header');
    const observer = window.ResizeObserver ? new ResizeObserver(invalidate) : null;
    if (observer) header?.querySelectorAll('.lighthouse-text, .header-content').forEach(element => observer.observe(element));
    return () => observer?.disconnect();
  }, [textKey]);

  useImperativeHandle(ref, () => {
    const update = frame => {
      const { seconds = 0, width, height, blend = 0, active } = frame;
      lastFrameRef.current = frame;
      const svg = svgRef.current;
      const header = svg?.closest('.site-header');
      if (!header) return;
      header.dataset.lighthouseActive = active && width > 0 && height > 0 ? 'true' : 'false';
      header.dataset.lighthouseLit = 'false';
      if (!active || !width || !height) return;
      const cone = lighthouseCone(width, height, seconds);
      // Crossfading cream text into navy at the same time as its backdrop
      // brightens would briefly erase contrast. Introduce the opaque, readable
      // navy/gold pair only once the shared dusk blend is strong enough.
      header.dataset.lighthouseLit = blend >= .65 && cone.strength >= .99 ? 'true' : 'false';
      const path = points => points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(3)} ${point.y.toFixed(3)}`).join(' ') + ' Z';
      coreRef.current.setAttribute('d', path(cone.points));
      haloRef.current.setAttribute('d', path(cone.haloPoints));
      header.style.setProperty('--lighthouse-strength', cone.strength.toFixed(6));
      for (const gradient of [coreGradientRef.current, haloGradientRef.current]) {
        gradient.setAttribute('cx', cone.origin.x);
        gradient.setAttribute('cy', cone.origin.y);
        gradient.setAttribute('r', cone.reach);
      }
      lampRef.current.setAttribute('cx', cone.origin.x);
      lampRef.current.setAttribute('cy', cone.origin.y);

      // Read layout only when size or translated text changes. The three text
      // copies share the core's exact triangle; soft glow never washes out letters.
      if (!layoutRef.current || layoutRef.current.width !== width || layoutRef.current.height !== height) {
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        filterRef.current.setAttribute('width', width);
        filterRef.current.setAttribute('height', height);
        const bounds = header.getBoundingClientRect();
        layoutRef.current = {
          width, height,
          text: [...header.querySelectorAll('.lighthouse-lit-text')].map(element => {
            const box = element.parentElement.getBoundingClientRect();
            return { element, left: box.left - bounds.left, top: box.top - bounds.top };
          }),
        };
      }
      for (const { element, left, top } of layoutRef.current.text) {
        element.style.setProperty('--lighthouse-clip', coneClip(cone.points, left, top));
      }
    };
    paintRef.current = update;
    return { update };
  }, []);

  // A font completing its first load can change line breaks without changing
  // the header's outer dimensions. Invalidate once rather than reading per frame.
  useLayoutEffect(() => {
    let mounted = true;
    document.fonts?.ready.then(() => {
      if (!mounted) return;
      layoutRef.current = null;
      if (lastFrameRef.current) paintRef.current?.(lastFrameRef.current);
    });
    return () => { mounted = false; };
  }, []);

  return <svg ref={svgRef} className="lighthouse-beam" aria-hidden="true" focusable="false">
    <defs>
      <filter ref={filterRef} id={haloId} filterUnits="userSpaceOnUse" x="0" y="0" width="0" height="0"><feGaussianBlur stdDeviation="9" /></filter>
      <radialGradient ref={coreGradientRef} id={`${haloId}-core`} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fce0a2" stopOpacity=".86" />
        <stop offset=".4" stopColor="#fce0a2" stopOpacity=".42" />
        <stop offset="1" stopColor="#fce0a2" stopOpacity="0" />
      </radialGradient>
      <radialGradient ref={haloGradientRef} id={`${haloId}-mist`} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fce0a2" stopOpacity=".22" />
        <stop offset="1" stopColor="#fce0a2" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path ref={haloRef} fill={`url(#${haloId}-mist)`} className="lighthouse-beam-halo" filter={`url(#${haloId})`} />
    <path ref={coreRef} fill={`url(#${haloId}-core)`} className="lighthouse-beam-core" />
    <circle ref={lampRef} r="11" className="lighthouse-lamp-glow" filter={`url(#${haloId})`} />
  </svg>;
});

export default LighthouseBeam;
