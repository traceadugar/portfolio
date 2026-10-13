import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
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

test('the navigation language selector translates About qualifications and preserves native language names', async () => {
  window.history.replaceState({}, '', '/about');
  render(<App />);
  await screen.findByRole('heading', { name: 'Certifications' });
  expect(screen.getByText('Google Cybersecurity Certificate')).toBeInTheDocument();
  expect(screen.getByText('Video Surveillance Tech')).toBeInTheDocument();
  expect(screen.getByText('LLSSA · Issued June 2025')).toBeInTheDocument();
  expect(screen.getByText('CompTIA · Issued April 2024 · Expires April 2027')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'CompTIA Security+ (opens in a new tab)' })).toHaveAttribute('href',
    'https://www.credly.com/badges/37f0df2a-7dce-405f-a097-2f81c667739a/linked_in_profile');
  expect(screen.getByRole('link', { name: 'Google Cybersecurity Certificate (opens in a new tab)' })).toHaveAttribute('href',
    'https://www.coursera.org/account/accomplishments/specialization/QDF3Y3VLNBQU');
  expect(screen.getByRole('link', { name: 'Google IT Support Professional Certificate (opens in a new tab)' })).toHaveAttribute('href',
    'https://www.coursera.org/account/accomplishments/professional-cert/29JZTFR78GY4');
  expect(screen.queryByText(/Linux\+/)).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  await screen.findByRole('heading', { name: '認定資格' });
  expect(screen.queryByText(/Linux\+/)).not.toBeInTheDocument();
  expect(screen.getByText('Google サイバーセキュリティ認定資格')).toBeInTheDocument();
  expect(screen.getByText('映像監視技術者')).toBeInTheDocument();
  expect(screen.getByText('LLSSA · 取得 2025年6月')).toBeInTheDocument();
  expect(screen.getByText('CompTIA · 取得 2024年4月 · 有効期限 2027年4月')).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('lang', 'en');
});

test('the gallery supports arrow keys and Escape restores focus to its project card', async () => {
  render(<App />);
  const project = await screen.findByRole('button', { name: 'View project details: Salmon Cookies' });
  project.focus();
  fireEvent.click(project);
  await screen.findByRole('dialog', { name: 'Salmon Cookies' });
  const gallery = screen.getByRole('group', { name: 'Project screenshots' });
  gallery.focus();
  fireEvent.keyDown(gallery, { key: 'ArrowRight' });
  expect(screen.getByRole('img', { name: 'Salmon Cookies — screenshot 2' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'Escape', code: 'Escape', keyCode: 27 });
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(project).toHaveFocus();
});

test('section links from About reach the loaded home section without reloading the portfolio', async () => {
  window.history.replaceState({}, '', '/about');
  render(<App />);
  await screen.findByRole('heading', { name: 'About me' });
  fireEvent.click(screen.getByRole('link', { name: 'Projects', exact: true }));
  const heading = await screen.findByRole('heading', { name: 'Projects & case studies' });
  expect(window.location.pathname).toBe('/');
  expect(window.location.hash).toBe('#portfolio');
  expect(heading).toHaveFocus();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('Home returns to the header after navigating within the home page', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Experience' });
  const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  fireEvent.click(navigation.getByRole('link', { name: 'Experience', exact: true }));
  expect(screen.getByRole('heading', { name: 'Experience' })).toHaveFocus();
  fireEvent.click(navigation.getByRole('link', { name: 'Home', exact: true }));
  expect(window.location.hash).toBe('');
  expect(screen.getByRole('heading', { name: 'Trace Dugar', exact: true })).toHaveFocus();
});

test('the featured case study opens a text-only writeup and returns to the projects section without reloading', async () => {
  render(<App />);
  const link = await screen.findByRole('link', { name: 'Read case study', exact: true });
  expect(link).toHaveAttribute('href', '/case-studies/tanmar-safety-platform');
  expect(screen.getByRole('img', { name: 'TanMar Communications logo' })).toHaveAttribute('src', '/images/brands/tanmar-communications-color.svg');
  fireEvent.click(link);
  const heading = await screen.findByRole('heading', { name: 'TanMar Safety Platform', level: 2 });
  expect(heading).toHaveFocus();
  const main = within(screen.getByRole('main'));
  expect(main.getByText(english.case_studies[0].status)).toBeInTheDocument();
  expect(main.getByRole('heading', { name: 'Directing AI-assisted development' })).toBeInTheDocument();
  expect(main.queryByRole('group', { name: 'Project screenshots' })).not.toBeInTheDocument();
  expect(main.queryByRole('link', { name: 'View repository' })).not.toBeInTheDocument();
  fireEvent.click(main.getAllByRole('link', { name: 'Back to projects', exact: true })[0]);
  const projects = await screen.findByRole('heading', { name: 'Projects & case studies' });
  expect(projects).toHaveFocus();
  expect(window.location.hash).toBe('#portfolio');
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('a direct case study section link focuses the section and the writeup switches to Japanese', async () => {
  window.history.replaceState({}, '', '/case-studies/tanmar-safety-platform#case-ai');
  render(<App />);
  const section = await screen.findByRole('heading', { name: 'Directing AI-assisted development' });
  expect(section).toHaveFocus();
  expect(screen.getByRole('navigation', { name: 'In this case study' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  const main = within(screen.getByRole('main'));
  expect(await main.findByText(japanese.case_studies[0].status)).toBeInTheDocument();
  expect(main.getByRole('heading', { name: japanese.case_studies[0].sections.find(item => item.id === 'ai').title })).toBeInTheDocument();
  expect(document.documentElement).toHaveAttribute('lang', 'ja');
  expect(main.getByRole('img', { name: japanese.case_studies[0].logoAlt })).toBeInTheDocument();
  expect(main.queryByText('Directing AI-assisted development')).not.toBeInTheDocument();
});
