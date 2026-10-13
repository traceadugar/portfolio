import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from './App';
import english from '../public/res_primaryLanguage.json';
import japanese from '../public/res_secondaryLanguage.json';
import shared from '../public/portfolio_shared_data.json';

jest.mock('./components/SeasideBackground', () => () => null);

beforeEach(() => {
  window.localStorage.clear();
  document.body.dataset.theme = 'light';
  document.documentElement.lang = 'en';
  window.history.replaceState({}, '', '/');
  global.fetch = jest.fn(async url => {
    const data = url === '/portfolio_shared_data.json' ? shared
      : url === '/res_secondaryLanguage.json' ? japanese
      : url === '/res_primaryLanguage.json' ? english : null;
    return { ok: Boolean(data), status: data ? 200 : 404, json: async () => data };
  });
});

afterEach(cleanup);

test('a direct About route with a trailing slash renders the profile with root-based image paths', async () => {
  window.history.replaceState({}, '', '/about/');
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'About me' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Profile photo of Trace Dugar' })).toHaveAttribute('src', '/images/thumbnails/profile.webp');
});

test('experience runs from the current role to the earliest training', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Experience' });
  expect(screen.getAllByRole('heading', { level: 4 }).map(element => element.textContent)).toEqual([
    'TanMar Communications', 'Ethos Risk Services', 'XLRX Logistics LLC', 'Code Fellows',
  ]);
  expect(screen.queryByText('Sep 2023 – Present')).not.toBeInTheDocument();
  expect(screen.getByText('Sep 2023 – Oct 2024')).toBeInTheDocument();
});

test('Japanese changes the document language, navigation, timeline dates and descriptions', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Experience' });
  fireEvent.click(screen.getByRole('button', { name: '日本語', exact: true }));
  await screen.findByRole('heading', { name: '職歴・学習歴' });
  expect(document.documentElement).toHaveAttribute('lang', 'ja');
  expect(screen.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('lang', 'en');
  expect(screen.getByRole('link', { name: 'ホーム', exact: true })).toBeInTheDocument();
  expect(screen.getByText('2024年10月 – 現在')).toBeInTheDocument();
  expect(screen.getByText('2023年9月 – 2024年10月')).toBeInTheDocument();
  expect(screen.getByText('メディアクエリ')).toBeInTheDocument();
  expect(document.body.textContent).not.toMatch(/Current|Media Queries|Responsive Design|File Conversions|IT Support Technician/);
  expect(window.localStorage.getItem('portfolioLanguage')).toBe('ja');
});

test('switching languages reuses shared and previously loaded content', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Experience' });
  fireEvent.click(screen.getByRole('button', { name: '日本語', exact: true }));
  await screen.findByRole('heading', { name: '職歴・学習歴' });
  fireEvent.click(screen.getByRole('button', { name: 'English', exact: true }));
  await screen.findByRole('heading', { name: 'Experience' });
  fireEvent.click(screen.getByRole('button', { name: '日本語', exact: true }));
  await screen.findByRole('heading', { name: '職歴・学習歴' });
  expect(global.fetch.mock.calls.map(([url]) => url).sort()).toEqual([
    '/portfolio_shared_data.json', '/res_primaryLanguage.json', '/res_secondaryLanguage.json',
  ]);
});

test('archived projects expose accessible details and repositories with working image controls', async () => {
  render(<App />);
  const project = await screen.findByRole('button', { name: 'View project details: Salmon Cookies' });
  fireEvent.click(project);
  const dialog = await screen.findByRole('dialog', { name: 'Salmon Cookies' });
  expect(dialog).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'View repository' })).toHaveAttribute('href', 'https://github.com/TraceDugar/cookie-stand');
  fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
  expect(screen.getByRole('img', { name: 'Salmon Cookies — screenshot 2' })).toHaveAttribute('src', '/images/portfolio/salmon-cookies/SalesPage.png');
  fireEvent.click(screen.getByRole('button', { name: 'Close project details' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const hrefs = Array.from(document.querySelectorAll('a')).map(element => element.href);
  expect(hrefs.join('\n')).not.toMatch(/tracedugar\.github\.io|virtual-store-traced\.onrender\.com|xlrx\.us/);
});

test('failed data loads show a recoverable error instead of an alert or blank page', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Network unavailable'));
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('The portfolio could not be loaded');
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('heading', { name: 'Experience' })).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('the named theme control changes and persists the selected theme', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Experience' });
  const control = screen.getByRole('switch', { name: 'Dark mode' });
  fireEvent.click(control);
  expect(control).toHaveAttribute('aria-checked', 'true');
  expect(document.body).toHaveAttribute('data-theme', 'dark');
  expect(window.localStorage.getItem('portfolioTheme')).toBe('dark');
});

test('unknown addresses explain the missing page and provide a way home', async () => {
  window.history.replaceState({}, '', '/missing-route');
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
});

test('the background can be paused and that preference survives a reload', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Experience' });
  fireEvent.click(screen.getByRole('button', { name: 'Pause animation' }));
  expect(document.querySelector('header')).toHaveAttribute('data-motion', 'paused');
  expect(window.localStorage.getItem('portfolioMotion')).toBe('paused');
  cleanup();
  render(<App />);
  await screen.findByRole('heading', { name: 'Experience' });
  fireEvent.click(screen.getByRole('button', { name: 'Play animation' }));
  expect(document.querySelector('header')).toHaveAttribute('data-motion', 'playing');
});
