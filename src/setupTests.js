import '@testing-library/jest-dom';

// JSDOM has no layout observer. Timeline animations are disabled in the app;
// responsive visibility is checked separately in a real browser.
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
