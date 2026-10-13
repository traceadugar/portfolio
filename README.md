# Trace Dugar's portfolio

A bilingual React portfolio, published at [traceportfolio.netlify.app](https://traceportfolio.netlify.app/). It presents current IT and software development experience alongside archived project screenshots.

## Run and verify

Use Node.js 24 and npm. From this directory:

```powershell
npm ci
npm start
```

Before publishing:

```powershell
$env:CI = 'true'
npm test -- --watchAll=false --runInBand
npm run build
```

The regression suite covers routing and section navigation, Japanese localization, timeline order, keyboard project galleries and focus restoration, recoverable data errors, saved preferences, synchronized lighting transitions, and reduced-motion/media fallbacks. Also inspect the production build in a browser at desktop and narrow mobile widths.

## Update content

- `public/res_primaryLanguage.json`: English profile, projects, and experience.
- `public/res_secondaryLanguage.json`: Japanese equivalents, with matching project IDs and experience order.
- `public/portfolio_shared_data.json`: shared identity, social links, skills, and certification metadata.
- `src/translations.js`: translated navigation, gallery controls, status messages, and accessibility labels.
- `public/images/portfolio/`: preserved screenshots of the projects when they were operational.

Keep experience ordered newest to oldest in both language files. Translate descriptive text, controls, and dates; retain official technology and brand names where appropriate. The document language is `en` or `ja`, and language and theme preferences persist locally.

Certification issuers, issue/expiry months, and verification URLs were observed on LinkedIn. Titles and date labels are localized in `src/translations.js`; About renders the dates in the selected language. A credential without a verification URL remains plain text.

Archive projects are historical work. Their hosted demos and dependent APIs have retired, so cards retain screenshots and verified repository links without demo buttons. A project with no verified public repository omits that link.

## TanMar case study

The featured TanMar Safety Platform card opens `/case-studies/tanmar-safety-platform`, a text-only case study of AI-assisted modernization and consolidation. The user-reviewed professional summary is stored in the `case_studies` array in each locale JSON file. Keep the English and Japanese section IDs aligned, and preserve the distinction between implemented test-environment workflows and production hardening.

The supplied official TanMar Communications SVG is self-hosted at `public/images/brands/tanmar-communications-color.svg`, sourced from https://www.tanmarcompanies.com/images/logos/tanmar-communications-color.svg. Its colors remain unchanged on a warm neutral plaque in both themes. The case study uses a shareable route, section anchors, and return links that preserve the shared seaside animation clock.

## Deploy

Netlify builds the `main` branch of [traceadugar/portfolio](https://github.com/traceadugar/portfolio), using `npm run build` and publishing `build/`. Push a tested commit to that branch, then confirm the deployment has published and check the live site.

`public/_redirects` serves the React app for direct route requests. React accepts both `/about` and `/about/`. Avoid redirects that add or remove a trailing slash: Netlify normalizes paths before matching rules, which can cause a redirect loop. Asset and data URLs start at `/` so direct visits and refreshes work. Unknown routes show a translated explanation and a link home. The application does not register a service worker.

## Recovery and maintenance

The site was recovered from the original repository and reconnected to the current GitHub account in October 2026. Original history and project screenshots remain intact. The existing Create React App toolchain was retained to keep this recovery incremental; a future toolchain migration should be tested separately.

## Optimization decisions

- English and Japanese language buttons always show their native names: `English` and `日本語`.
- Shared data and each translation load once per app session. Failed requests can be retried, and reloading the page checks the deployed files again.
- Project details load in a separate JavaScript chunk when a card opens. React Bootstrap remains responsible for modal focus, Escape dismissal, and focus restoration.
- The timeline uses a single ordered list with dates first. It preserves newest-first chronology and the same reading order on desktop and mobile.
- Bootstrap supplies the modal, transition, reset, and accessibility helpers. The layout and component styles use native CSS grid and flexbox. Retired grid/card/badge utilities and the old alternating timeline stylesheet were removed.
- Local SVGs replace the external icon fonts and Iconify runtime. Icon sources and licenses are in `public/licenses/`.
- Responsive WebP thumbnails reduce card and profile transfers. The original screenshots remain unchanged and are used in the gallery.

After changing a project's first screenshot or the shared profile image, regenerate thumbnails before building:

```powershell
npm run optimize:images
npm run build
```

Thumbnails are checked into Git, so Netlify does not need to regenerate them.

## Seaside background

The custom header shows a miniature California seaside town with Trace's stylized avatar in modern clothes. Light theme uses the sunny scene; dark theme uses its matching late-dusk scene. Only the ocean and a narrow band of surf washing up the sand move. The wave cycle uses periodic displacement, with an identical virtual start/end frame; the repeated endpoint is omitted from playback.

Desktop and mobile MP4 assets live in `public/images/backgrounds/`. Each video frame contains the day and dusk scenes side by side. A single video supplies both halves to the header canvas, keeping the waves at exactly the same point in the four-second cycle. The theme switch blends those halves over 1.2 seconds without replacing the video or seeking its playback clock. Reversing the switch during a fade starts from the current blend.

Pause freezes the current wave position and still permits a lighting fade. Reduced motion uses static posters without loading the video. Posters also provide a fallback if playback or canvas rendering fails. Animation controls are translated, and the visitor's pause preference persists locally. Mobile visitors receive a smaller video; canvas redraws skip unchanged frames when the theme is stable. The original generated artwork and prompts are retained in `assets/source/`.

## Seaside interface

The interface extends the artwork through warm sand surfaces, dark teal controls, terracotta accents, rounded panels, and lightly raised buttons. Dusk uses ocean and violet surfaces with lantern gold and lavender accents. Colors were sampled from the approved GIF frames and adjusted for readable contrast; the samples, coordinates, derivations, and contrast checks are retained in `assets/design/seaside-palette.json`. Edit the approved endpoint palettes in `src/themePalette.js` and their initial CSS fallbacks in `src/App.scss` rather than adding unrelated colors to individual components.

The page surfaces and scene lighting share one 1.2-second cosine fade in `SeasideBackground`. Each canvas paint sends its exact blend value to `themePalette.js`; posters use that same scalar. No independent CSS color timers can drift behind it. Text, links, and focus colors resolve against their actual page, card, chip, or wash background throughout the fade, because a continuous light-to-dark foreground crossing would briefly become unreadable. Primary button labels also account for the decorative sheen. Reversals start from the current blend, pause freezes only the waves, and reduced motion selects the final palette immediately. Palette tests sample 1,201 blend positions to check text and button contrast of at least 4.5:1 and control outlines of at least 3:1.

Project cards show a short description, technology chips, archive status, and a clear details action; XLRX's delivered client work appears first. The gallery keeps the original screenshots, supports arrow keys and Escape, and restores focus to the card on closing. About separates biography, qualifications, and contact actions. Qualification text is based on the supplied profile.

The sticky navigation offers page and section links, language selection, theme, and motion controls. `RouteNavigation` waits for content before following a section fragment and places keyboard focus at the destination. Navigation uses React Router links to preserve the shared video clock. A skip link, visible focus indicators, labelled icon controls, and touch targets of at least 44 pixels support keyboard and mobile use.

[Nunito Sans](https://fontsource.org/fonts/nunito-sans/about) is self-hosted as one 31 KB variable Latin WOFF2 file, sourced from Fontsource's npm package version 5.3.0. Its original SIL Open Font License is in `public/licenses/nunito-sans.txt`. Japanese uses the visitor's installed Japanese font fallback. Original rounded `shore-*` SVGs live in `Icon.js`; technology and social brand symbols retain the licensed local sprite. No external font or icon service is required.
