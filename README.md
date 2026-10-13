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

The regression suite covers routing, Japanese localization, timeline order, project galleries, recoverable data errors, and saved theme preferences. Also inspect the production build in a browser at desktop and narrow mobile widths.

## Update content

- `public/res_primaryLanguage.json`: English profile, projects, and experience.
- `public/res_secondaryLanguage.json`: Japanese equivalents, with matching project IDs and experience order.
- `public/portfolio_shared_data.json`: shared identity, social links, and skills.
- `src/translations.js`: translated navigation, gallery controls, status messages, and accessibility labels.
- `public/images/portfolio/`: preserved screenshots of the projects when they were operational.

Keep experience ordered newest to oldest in both language files. Translate descriptive text, controls, and dates; retain official technology and brand names where appropriate. The document language is `en` or `ja`, and language and theme preferences persist locally.

Projects are historical work. Their hosted demos and dependent APIs have retired, so cards retain screenshots and verified repository links without demo buttons. A project with no verified public repository omits that link.

## Deploy

Netlify builds the `main` branch of [traceadugar/portfolio](https://github.com/traceadugar/portfolio), using `npm run build` and publishing `build/`. Push a tested commit to that branch, then confirm the deployment has published and check the live site.

`public/_redirects` serves the React app for direct route requests. React accepts both `/about` and `/about/`. Avoid redirects that add or remove a trailing slash: Netlify normalizes paths before matching rules, which can cause a redirect loop. Asset and data URLs start at `/` so direct visits and refreshes work. Unknown routes show a translated explanation and a link home. The application does not register a service worker.

## Recovery and maintenance

The site was recovered from the original repository and reconnected to the current GitHub account in October 2026. Original history and project screenshots remain intact. The existing Create React App toolchain was retained to keep this recovery incremental; a future toolchain migration should be tested separately.

## Optimization decisions

- English and Japanese language buttons always show their native names: `English` and `日本語`.
- Shared data and each translation load once per app session. Failed requests can be retried, and reloading the page checks the deployed files again.
- Project details load in a separate JavaScript chunk when a card opens. React Bootstrap remains responsible for modal focus, Escape dismissal, and focus restoration.
- The timeline uses an ordered list and static CSS rather than a JavaScript timeline package or visibility observer.
- Bootstrap Sass imports only the grid, typography, card, badge, modal, and supporting styles used by the site. Retired slider styles, switch packages, service-worker scaffolding, and deployment scripts were removed.
- Local SVGs replace the external icon fonts and Iconify runtime. Icon sources and licenses are in `public/licenses/`.
- Responsive WebP thumbnails reduce card and profile transfers. The original screenshots remain unchanged and are used in the gallery.

After changing a project's first screenshot or the shared profile image, regenerate thumbnails before building:

```powershell
npm run optimize:images
npm run build
```

Thumbnails are checked into Git, so Netlify does not need to regenerate them. The animated header backgrounds remain part of the current design; replacing those assets belongs to the planned aesthetic overhaul.
