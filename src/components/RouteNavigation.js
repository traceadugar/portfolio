import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteNavigation({ ready }) {
  const location = useLocation();
  const previousLocation = useRef(null);
  useEffect(() => {
    if (!ready) return;
    const navigated = previousLocation.current !== null && previousLocation.current.key !== location.key;
    previousLocation.current = location;
    let target = null;
    if (location.hash) {
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { /* Invalid URL fragment. */ }
    } else if (navigated || location.pathname !== '/') {
      target = document.getElementById(location.pathname === '/' ? 'home' : 'main-content');
    }
    if (!target) return;
    const scrollTarget = target.querySelector('.section-heading') || target;
    scrollTarget.scrollIntoView?.({ block: 'start', behavior: 'auto' });
    const focusTarget = target.querySelector('h2, h1') || target;
    focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });
  }, [location, ready]);
  return null;
}
