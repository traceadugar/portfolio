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
  const card = await screen.findByRole('article', { name: 'TanMar Safety Platform' });
  const link = within(card).getByRole('link', { name: 'Read case study', exact: true });
  expect(link).toHaveAttribute('href', '/case-studies/tanmar-safety-platform');
  expect(screen.getByRole('img', { name: 'TanMar Communications logo' })).toHaveAttribute('src', '/images/brands/tanmar-communications-color.svg');
  fireEvent.click(link);
  const heading = await screen.findByRole('heading', { name: 'TanMar Safety Platform', level: 2 });
  expect(heading).toHaveFocus();
  const main = within(screen.getByRole('main'));
  expect(main.getByText('Aug 2026', { selector: 'time' })).toHaveAttribute('datetime', '2026-08');
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

test('TanMar and Aquarium stay pinned while other projects and case studies share newest-first order', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Projects & case studies' });
  const selectedTitles = ['TanMar Safety Platform', 'Aquarium', 'Portfolio Recovery & Seaside Redesign', 'Linux Ticket Generator & RHEL Lab', 'PaleHorse Intro Script', 'XLRX Logistics LLC Website Redesign'];
  const headings = screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent);
  expect(headings.filter(title => selectedTitles.includes(title))).toEqual(selectedTitles);
  for (const title of ['TanMar Safety Platform', 'Aquarium']) {
    expect(within(screen.getByRole('article', { name: title })).getByText('Featured case study', { exact: true })).toBeInTheDocument();
  }
  const card = screen.getByRole('article', { name: 'Linux Ticket Generator & RHEL Lab' });
  expect(within(card).getByText('Case study', { exact: true })).toBeInTheDocument();
  expect(within(card).queryByText('Featured case study', { exact: true })).not.toBeInTheDocument();
  fireEvent.click(within(card).getByRole('link', { name: 'Read case study', exact: true }));
  expect(await screen.findByRole('heading', { name: 'Linux Ticket Generator & RHEL Lab', level: 2 })).toHaveFocus();
  expect(window.location.pathname).toBe('/case-studies/linux-ticket-queue');
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('case-study cards show localized project start months with machine-readable dates', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Projects & case studies' });
  const dates = [
    { id: 'tanmar-safety-platform', value: '2026-08', en: 'Aug 2026', ja: '2026年8月' },
    { id: 'aquarium', value: '2026-09', en: 'Sep 2026', ja: '2026年9月' },
    { id: 'linux-ticket-queue', value: '2026-04', en: 'Apr 2026', ja: '2026年4月' },
  ];
  for (const date of dates) {
    const study = english.case_studies.find(item => item.id === date.id);
    const card = within(screen.getByRole('article', { name: study.title }));
    expect(card.getByText(date.en, { selector: 'time' })).toHaveAttribute('datetime', date.value);
  }
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  await screen.findByRole('heading', { name: japanese.basic_info.section_name.projects });
  const linux = japanese.case_studies.find(item => item.id === 'linux-ticket-queue');
  const linuxCard = within(screen.getByRole('article', { name: linux.title }));
  expect(linuxCard.getByText('ケーススタディ', { exact: true })).toBeInTheDocument();
  expect(linuxCard.queryByText('注目のケーススタディ', { exact: true })).not.toBeInTheDocument();
  for (const date of dates) {
    const study = japanese.case_studies.find(item => item.id === date.id);
    const card = within(screen.getByRole('article', { name: study.title }));
    expect(card.getByText(date.ja, { selector: 'time' })).toHaveAttribute('datetime', date.value);
    expect(card.queryByText(date.en)).not.toBeInTheDocument();
  }
});

test('the Linux case study supports direct sections and Japanese GitHub source links', async () => {
  window.history.replaceState({}, '', '/case-studies/linux-ticket-queue#case-ai');
  render(<App />);
  const study = english.case_studies.find(item => item.id === 'linux-ticket-queue');
  const aiSection = study.sections.find(item => item.id === 'ai');
  expect(await screen.findByRole('heading', { name: aiSection.title })).toHaveFocus();
  expect(screen.getByText('Apr 2026', { selector: 'time' })).toHaveAttribute('datetime', '2026-04');
  for (const source of study.sources) {
    expect(screen.getByRole('link', { name: new RegExp(source.title) })).toHaveAttribute('href', source.url);
  }
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  const translated = japanese.case_studies.find(item => item.id === 'linux-ticket-queue');
  expect(await screen.findByRole('heading', { name: translated.title, level: 2 })).toBeInTheDocument();
  expect(screen.getByText('2026年4月', { selector: 'time' })).toHaveAttribute('datetime', '2026-04');
  expect(screen.getByRole('heading', { name: translated.sections.find(item => item.id === 'ai').title })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: aiSection.title })).not.toBeInTheDocument();
  expect(document.documentElement).toHaveAttribute('lang', 'ja');
  expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
  for (const source of translated.sources) {
    expect(screen.getByRole('link', { name: new RegExp(source.title) })).toHaveAttribute('href', source.url);
  }
  expect(screen.queryByText(/Linux\+/)).not.toBeInTheDocument();
});

test('Aquarium opens directly with its project date, translates, and returns to projects', async () => {
  window.history.replaceState({}, '', '/case-studies/aquarium/#case-ai');
  render(<App />);
  const study = english.case_studies.find(item => item.id === 'aquarium');
  const aiSection = study.sections.find(item => item.id === 'ai');
  expect(await screen.findByRole('heading', { name: aiSection.title })).toHaveFocus();
  const main = within(screen.getByRole('main'));
  expect(main.getByRole('heading', { name: study.title, level: 2 })).toBeInTheDocument();
  expect(main.getByText('Sep 2026', { selector: 'time' })).toHaveAttribute('datetime', '2026-09');
  expect(main.getByText(study.status)).toBeInTheDocument();
  expect(main.getByRole('img', { name: study.imageAlt })).toHaveAttribute('src', '/images/portfolio/aquarium/aquarium-title.webp');
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  const translated = japanese.case_studies.find(item => item.id === 'aquarium');
  expect(await main.findByText(translated.status)).toBeInTheDocument();
  expect(await main.findByRole('heading', { name: translated.title, level: 2 })).toBeInTheDocument();
  expect(main.getByText('2026年9月', { selector: 'time' })).toHaveAttribute('datetime', '2026-09');
  expect(main.getByRole('heading', { name: translated.sections.find(item => item.id === 'ai').title })).toBeInTheDocument();
  expect(main.queryByText('Sep 2026')).not.toBeInTheDocument();
  fireEvent.click(main.getAllByRole('link', { name: '制作実績に戻る', exact: true })[0]);
  const projects = await screen.findByRole('heading', { name: japanese.basic_info.section_name.projects });
  expect(projects).toHaveFocus();
  expect(window.location.pathname).toBe('/');
  expect(window.location.hash).toBe('#portfolio');
  const card = within(screen.getByRole('article', { name: translated.title }));
  expect(card.getByText('2026年9月', { selector: 'time' })).toHaveAttribute('datetime', '2026-09');
  expect(global.fetch).toHaveBeenCalledTimes(3);
});

test('Aquarium evidence has dated anchors and an accessible, user-controlled diagnostic video in both languages', async () => {
  window.history.replaceState({}, '', '/case-studies/aquarium#case-evidence');
  render(<App />);
  const study = english.case_studies.find(item => item.id === 'aquarium');
  const evidence = study.sections.find(item => item.id === 'evidence');
  expect(await screen.findByRole('heading', { name: evidence.title })).toHaveFocus();
  const video = screen.getByLabelText(evidence.video.title);
  expect(video.tagName).toBe('VIDEO');
  expect(video).toHaveAttribute('controls');
  expect(video).toHaveAttribute('playsinline');
  expect(video).toHaveAttribute('preload', 'none');
  expect(video).not.toHaveAttribute('autoplay');
  expect(video).not.toHaveAttribute('loop');
  expect(video).toHaveAttribute('poster', evidence.video.poster);
  expect(video.querySelector('source')).toHaveAttribute('src', evidence.video.src);
  expect(video).toHaveAccessibleDescription(evidence.video.caption);
  expect(screen.getByRole('link', { name: /Open the diagnostic clip/ })).toHaveAttribute('href', evidence.video.src);
  expect(screen.getByText(evidence.date, { selector: 'time' })).toHaveAttribute('datetime', '2026-10-11');
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  const translated = japanese.case_studies.find(item => item.id === 'aquarium').sections.find(item => item.id === 'evidence');
  await screen.findByRole('heading', { name: translated.title });
  expect(screen.getByLabelText(translated.video.title)).toHaveAccessibleDescription(translated.video.caption);
  expect(screen.getByText(translated.date, { selector: 'time' })).toHaveAttribute('datetime', '2026-10-11');
  expect(screen.getByRole('link', { name: /検証用動画を開く/ })).toHaveAttribute('href', evidence.video.src);
  expect(screen.queryByText(evidence.video.caption)).not.toBeInTheDocument();
});

test('Linux exercise links focus dated evidence and render sanitized output as keyboard-accessible text in both languages', async () => {
  window.history.replaceState({}, '', '/case-studies/linux-ticket-queue#case-login-evidence');
  render(<App />);
  const study = english.case_studies.find(item => item.id === 'linux-ticket-queue');
  const login = study.sections.find(item => item.id === 'login-evidence');
  const privilege = study.sections.find(item => item.id === 'privilege-evidence');
  expect(await screen.findByRole('heading', { name: login.title })).toHaveFocus();
  const transcript = screen.getByLabelText(privilege.transcript.title);
  expect(transcript.tagName).toBe('PRE');
  expect(transcript).toHaveAttribute('tabindex', '0');
  expect(transcript.textContent).toContain('groups=1001(jrodriguez),10(wheel)');
  expect(transcript.textContent).toContain('wheel:x:10:<lab_admin>');
  expect(transcript.querySelector('lab_admin')).toBeNull();
  expect(screen.getByLabelText(login.transcript.title)).toHaveTextContent('/home/mthompson:/bin/bash');
  expect(screen.getAllByText('May 2, 2026', { selector: 'time' })).toHaveLength(2);
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  const translated = japanese.case_studies.find(item => item.id === 'linux-ticket-queue');
  const translatedPrivilege = translated.sections.find(item => item.id === 'privilege-evidence');
  await screen.findByRole('heading', { name: translatedPrivilege.title });
  expect(screen.getByLabelText(translatedPrivilege.transcript.title)).toHaveTextContent('wheel:x:10:<lab_admin>');
  expect(screen.getAllByText('2026年5月2日', { selector: 'time' })).toHaveLength(2);
  expect(screen.queryByRole('heading', { name: login.title })).not.toBeInTheDocument();
});

test('the PaleHorse script opens current project details with code and journal links', async () => {
  render(<App />);
  const trigger = await screen.findByRole('button', { name: 'View project details: PaleHorse Intro Script' });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = within(await screen.findByRole('dialog', { name: 'PaleHorse Intro Script' }));
  expect(dialog.queryByText('Archived project')).not.toBeInTheDocument();
  expect(dialog.queryByText(/Live demos are retired/)).not.toBeInTheDocument();
  expect(dialog.getByRole('link', { name: /View repository/ })).toHaveAttribute('href', 'https://github.com/traceadugar/ProjectJournal/blob/main/April%2026/intoScript/intro.sh');
  expect(dialog.getByRole('link', { name: /Read project journal/ })).toHaveAttribute('href', 'https://github.com/traceadugar/ProjectJournal/blob/main/April%2026/introScript.md');
  expect(dialog.getByRole('img')).toHaveAttribute('src', '/images/portfolio/palehorse-intro-script/palehorseintro.webp');
  fireEvent.click(dialog.getByRole('button', { name: 'Close project details' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
});

test('the portfolio refresh opens project details with labelled before-and-after images in both languages', async () => {
  render(<App />);
  const trigger = await screen.findByRole('button', { name: 'View project details: Portfolio Recovery & Seaside Redesign' });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = within(await screen.findByRole('dialog', { name: 'Portfolio Recovery & Seaside Redesign' }));
  expect(dialog.getByRole('img')).toHaveAttribute('src', '/images/portfolio/portfolio-refresh/after-home-day.webp');
  expect(dialog.getByText(/After — seaside homepage in day mode/)).toHaveTextContent('Image 1 of 8');
  expect(dialog.getByRole('link', { name: /Open full-size image/ })).toHaveAttribute('href', '/images/portfolio/portfolio-refresh/after-home-day.webp');
  expect(dialog.queryByText('Archived project')).not.toBeInTheDocument();
  expect(dialog.queryByRole('link', { name: 'Read case study' })).not.toBeInTheDocument();
  expect(dialog.getByRole('link', { name: /View repository/ })).toHaveAttribute('href', 'https://github.com/traceadugar/portfolio');
  fireEvent.click(dialog.getByRole('button', { name: 'Next image' }));
  expect(dialog.getByRole('img')).toHaveAttribute('src', '/images/portfolio/portfolio-refresh/before-home-day.webp');
  expect(dialog.getByText(/Before — original homepage and biography in day mode/)).toHaveTextContent('Image 2 of 8');
  expect(dialog.getByRole('link', { name: /Open full-size image/ })).toHaveAttribute('href', '/images/portfolio/portfolio-refresh/before-home-day.webp');
  const gallery = dialog.getByRole('group', { name: 'Project screenshots' });
  gallery.focus();
  fireEvent.keyDown(gallery, { key: 'ArrowRight' });
  expect(dialog.getByRole('img')).toHaveAttribute('src', '/images/portfolio/portfolio-refresh/after-projects-day.webp');
  fireEvent.click(dialog.getByRole('button', { name: 'Show image 8' }));
  expect(dialog.getByRole('img')).toHaveAttribute('src', '/images/portfolio/portfolio-refresh/before-home-dusk.webp');
  expect(dialog.getByRole('heading', { name: 'One shared animation clock' })).toBeInTheDocument();
  fireEvent.click(dialog.getByRole('button', { name: 'Close project details' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'ja' } });
  const translated = japanese.current_projects.find(project => project.id === 'portfolio-refresh');
  fireEvent.click(await screen.findByRole('button', { name: `プロジェクトの詳細を表示: ${translated.title}` }));
  const translatedDialog = within(await screen.findByRole('dialog', { name: translated.title }));
  expect(translatedDialog.getByRole('img')).toHaveAttribute('alt', translated.imageAlts[0]);
  expect(translatedDialog.getByText(new RegExp(translated.imageCaptions[0]))).toHaveTextContent('画像 1 / 8');
  expect(translatedDialog.getByRole('link', { name: /画像を原寸で開く/ })).toHaveAttribute('href', '/images/portfolio/portfolio-refresh/after-home-day.webp');
  expect(translatedDialog.getByRole('heading', { name: translated.highlights[0].title })).toBeInTheDocument();
  expect(translatedDialog.queryByText(/One shared animation clock|After —|Before —/)).not.toBeInTheDocument();
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
  expect(main.getByText('2026年8月', { selector: 'time' })).toHaveAttribute('datetime', '2026-08');
  expect(main.getByRole('heading', { name: japanese.case_studies[0].sections.find(item => item.id === 'ai').title })).toBeInTheDocument();
  expect(document.documentElement).toHaveAttribute('lang', 'ja');
  expect(main.getByRole('img', { name: japanese.case_studies[0].logoAlt })).toBeInTheDocument();
  expect(main.queryByText('Directing AI-assisted development')).not.toBeInTheDocument();
});
