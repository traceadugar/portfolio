import React, { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import { DISTANT_HILL_PATH, FOREGROUND_OCCLUSION_PATH, SEASIDE_LIGHT_SOURCE } from './seasideLightOcclusion';

const LOOP_SECONDS = 16;
const LAMP = { x: 1150, y: 75 };
const LIGHT_PLANE_HEIGHT = 190;

// Match the ocean's source crop; the lamp can remain offscreen at narrow sizes.
export function seasideLightCover(width, height) {
  const scale = Math.max(width / SEASIDE_LIGHT_SOURCE.width, height / SEASIDE_LIGHT_SOURCE.height);
  const narrow = width <= 500;
  return {
    scale,
    x: (width - SEASIDE_LIGHT_SOURCE.width * scale) * (narrow ? .31 : .5),
    y: (height - SEASIDE_LIGHT_SOURCE.height * scale) * (narrow ? .5 : .6),
  };
}

// A horizontal rotation projected into the scene. The near pass travels behind
// the town; the far return is shorter, narrower and dimmer on the distant hill.
export function seasideBeacon(seconds) {
  const angle = (seconds % LOOP_SECONDS) / LOOP_SECONDS * Math.PI * 2;
  const depth = (Math.sin(angle) + 1) / 2;
  const reach = 380 + 950 * depth;
  const end = {
    x: LAMP.x - Math.cos(angle) * reach,
    y: LAMP.y + Math.cos(angle) * (20 + 85 * (1 - depth)) + Math.sin(angle) * 8,
  };
  const halfWidth = 2.6 + 11 * depth;
  const side = Math.abs(Math.cos(angle));
  const visibility = side * side * (3 - 2 * side);
  const triangle = width => [LAMP, { x: end.x, y: end.y - width }, { x: end.x, y: end.y + width }];
  return {
    origin: LAMP, end, reach, halfWidth,
    core: triangle(halfWidth), halo: triangle(halfWidth * 2.8),
    nearOpacity: visibility * depth,
    farOpacity: visibility * (1 - depth) * .72,
    // Briefly catch the viewer as the near cone becomes edge-on. The far-facing
    // half stays dark, and the pulse shares this existing scene clock.
    glint: Math.max(0, Math.sin(angle)) ** 48,
  };
}

const pathFor = points => points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(3)} ${point.y.toFixed(3)}`).join(' ') + ' Z';

const LighthouseBeam = forwardRef(function LighthouseBeam(props, ref) {
  const svgRef = useRef(null);
  const sceneRef = useRef(null);
  const coreRef = useRef(null);
  const haloRef = useRef(null);
  const coreGradientRef = useRef(null);
  const haloGradientRef = useRef(null);
  const nearRef = useRef(null);
  const farRef = useRef(null);
  const airGlintRef = useRef(null);
  const windowGlintRef = useRef(null);
  const id = `seaside-beacon-${useId().replace(/:/g, '')}`;

  useImperativeHandle(ref, () => ({
    update({ seconds = 0, width, height, active }) {
      const svg = svgRef.current;
      const header = svg?.closest('.site-header');
      if (!header) return;
      header.dataset.lighthouseActive = active && width > 0 && height > 0 ? 'true' : 'false';
      if (!active || !width || !height) return;
      const cover = seasideLightCover(width, height);
      const beacon = seasideBeacon(seconds);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      sceneRef.current.setAttribute('transform', `translate(${cover.x} ${cover.y}) scale(${cover.scale})`);
      coreRef.current.setAttribute('d', pathFor(beacon.core));
      haloRef.current.setAttribute('d', pathFor(beacon.halo));
      nearRef.current.setAttribute('opacity', beacon.nearOpacity.toFixed(6));
      farRef.current.setAttribute('opacity', beacon.farOpacity.toFixed(6));
      airGlintRef.current.setAttribute('opacity', (beacon.glint * .2).toFixed(6));
      windowGlintRef.current.setAttribute('opacity', (beacon.glint * .68).toFixed(6));
      for (const gradient of [coreGradientRef.current, haloGradientRef.current]) {
        gradient.setAttribute('x2', beacon.end.x);
        gradient.setAttribute('y2', beacon.end.y);
      }
    },
  }), []);

  const light = <>
    <use href={`#${id}-halo-shape`} fill={`url(#${id}-halo-color)`} filter={`url(#${id}-mist)`} />
    <use href={`#${id}-core-shape`} fill={`url(#${id}-core-color)`} filter={`url(#${id}-soft)`} />
  </>;

  return <svg ref={svgRef} className="lighthouse-beam" aria-hidden="true" focusable="false">
    <defs>
      <path ref={coreRef} id={`${id}-core-shape`} />
      <path ref={haloRef} id={`${id}-halo-shape`} />
      <linearGradient ref={coreGradientRef} id={`${id}-core-color`} gradientUnits="userSpaceOnUse" x1={LAMP.x} y1={LAMP.y}>
        <stop offset="0" stopColor="#fce0a2" stopOpacity=".38" />
        <stop offset=".55" stopColor="#fce0a2" stopOpacity=".3" />
        <stop offset=".9" stopColor="#fce0a2" stopOpacity=".08" />
        <stop offset="1" stopColor="#fce0a2" stopOpacity="0" />
      </linearGradient>
      <linearGradient ref={haloGradientRef} id={`${id}-halo-color`} gradientUnits="userSpaceOnUse" x1={LAMP.x} y1={LAMP.y}>
        <stop offset="0" stopColor="#fce0a2" stopOpacity=".18" />
        <stop offset=".5" stopColor="#fce0a2" stopOpacity=".07" />
        <stop offset="1" stopColor="#fce0a2" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-window-color`}>
        <stop offset="0" stopColor="#fff8df" />
        <stop offset=".55" stopColor="#fff0bc" stopOpacity=".8" />
        <stop offset="1" stopColor="#fce0a2" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-soft`} filterUnits="userSpaceOnUse" x="0" y="0" width={SEASIDE_LIGHT_SOURCE.width} height={LIGHT_PLANE_HEIGHT}>
        <feGaussianBlur stdDeviation="1.3" />
      </filter>
      <filter id={`${id}-mist`} filterUnits="userSpaceOnUse" x="0" y="0" width={SEASIDE_LIGHT_SOURCE.width} height={LIGHT_PLANE_HEIGHT}>
        <feGaussianBlur stdDeviation="5.8" />
      </filter>
      <clipPath id={`${id}-plane`}><rect width={SEASIDE_LIGHT_SOURCE.width} height={LIGHT_PLANE_HEIGHT} /></clipPath>
      <mask id={`${id}-foreground`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width={SEASIDE_LIGHT_SOURCE.width} height={SEASIDE_LIGHT_SOURCE.height} style={{ maskType: 'luminance' }}>
        <rect width={SEASIDE_LIGHT_SOURCE.width} height={SEASIDE_LIGHT_SOURCE.height} fill="white" />
        <path d={FOREGROUND_OCCLUSION_PATH} fill="black" />
      </mask>
      <mask id={`${id}-hill`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width={SEASIDE_LIGHT_SOURCE.width} height={SEASIDE_LIGHT_SOURCE.height} style={{ maskType: 'luminance' }}>
        <rect width={SEASIDE_LIGHT_SOURCE.width} height={SEASIDE_LIGHT_SOURCE.height} fill="black" />
        <path d={DISTANT_HILL_PATH} fill="white" />
      </mask>
    </defs>
    <g ref={sceneRef}>
      {/* Mask after both blur filters, so scattered glow cannot leak over palms. */}
      <g clipPath={`url(#${id}-plane)`} mask={`url(#${id}-foreground)`}>
        <g ref={nearRef} data-light-pass="near">{light}</g>
        <g ref={farRef} data-light-pass="far" mask={`url(#${id}-hill)`}>{light}</g>
        <g ref={airGlintRef} opacity="0" data-light-glint="air">
          <circle cx={LAMP.x} cy={LAMP.y} r="18" fill="#fce0a2" filter={`url(#${id}-mist)`} />
        </g>
      </g>
      {/* Only the tiny lamp window emits in front of the tower silhouette. */}
      <g clipPath={`url(#${id}-plane)`}>
        <circle ref={windowGlintRef} data-light-glint="window" cx={LAMP.x} cy={LAMP.y} r="3" opacity="0" fill={`url(#${id}-window-color)`} />
      </g>
    </g>
  </svg>;
});

export default LighthouseBeam;
