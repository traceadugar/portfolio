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

Skills cover tools used in projects and practices supported by project evidence or employment history. Each `skills.icons` entry has an explicit `group` (`systems`, `development`, `ai`, or `security`). Technology names stay in the shared file; a `label` key localizes descriptive practices through `translations.js`. Optional `evidence` routes turn a skill into a link to its supporting example, using React Router to preserve the shared scene clock. Keep the scope tied to actual experience; the section does not assign proficiency ratings or imply independent authorship of AI-written code. Brand SVGs are self-hosted in the existing sprite, with source and license information in `public/licenses/new-skill-symbols.txt`; practices use original rounded line icons.

## TanMar case study

The featured TanMar Safety Platform card opens `/case-studies/tanmar-safety-platform`, a text-only case study of AI-assisted modernization and consolidation. The user-reviewed professional summary is stored in the `case_studies` array in each locale JSON file. Keep the English and Japanese section IDs aligned, and preserve the distinction between implemented test-environment workflows and production hardening.

The supplied official TanMar Communications SVG is self-hosted at `public/images/brands/tanmar-communications-color.svg`, sourced from https://www.tanmarcompanies.com/images/logos/tanmar-communications-color.svg. Its colors remain unchanged on a warm neutral plaque in both themes. The case study uses a shareable route, section anchors, and return links that preserve the shared seaside animation clock.

Case-study cards and detail pages display localized project start months with semantic `time` elements, placed at the lower right of the image, logo plaque, or fallback emblem. They reuse the project cards' `project-year` badge so placement, typography, and theme colors stay uniform. Logo and emblem panels reserve room for the badge. `startDate` is the display text and `sortDate` is its machine-readable `YYYY-MM` value. TanMar began in August 2026 and remains pinned first for relevance; its date does not override that rule. The Linux case study uses April 2026, matching the ticket workflow journal.

## Aquarium case study

`/case-studies/aquarium` presents an ongoing experiment in prompt-only AI development, beginning in September 2026. Trace sets the product direction, observes, playtests, and critiques; AI agents perform implementation and project changes. The writeup explains the observation-first game, presentation/persistence boundaries, iterative creature design, performance tradeoffs, and independent verification without presenting the experiment as complete.

The development-preview screenshot is self-hosted at `public/images/portfolio/aquarium/aquarium-title.webp`. It is an optimized copy of the October 10 native title capture `cory-forage-20261010/native-qa/frozen-02/title-19.png`, source commit `d848c2444f2240e3d7a8ac0db791ffaed39260a5`. It documents historical live title presentation, which is distinct from the persistent gameplay roster. Keep both locale files aligned and preserve the in-development status. No public repository or playable-demo link is supplied for Aquarium.

The Aquarium entry also includes dated historical examples from October 2026. The four-second `cory-foraging-diagnostic.mp4` is an unchanged H.264 diagnostic witness from the October 11 native cory run; its SHA-256 is `df0d4277dab0edb37c65053a6f21cf920b5ec05587e57f49cb00786f111505e5`. The WebP poster is extracted from the same clip. Playback is manual, with native controls, no preload, no autoplay, and an accessible translated description and direct link. The separate camera and extended visit are diagnostic conditions, not ordinary gameplay or a performance benchmark. The 458 foraging checks and six-fish departure result describe focused historical fixtures, not whole-game acceptance.

The context example records the October 10 documentation checkpoint: mandatory startup reading fell from 5,228 to 2,543 whitespace-separated words. It does not measure present-day context or token cost. A rejected contact-index optimization illustrates why passing sampled comparisons did not outweigh an independent static boundary finding. Preserve these qualifications when updating the copy.

## PaleHorse case study and script

The Linux Ticket Generator & RHEL Lab case study opens `/case-studies/linux-ticket-queue`. Its English and Japanese copy combines the public RHEL build journal with the AI-guided ticket workflow: a real lab baseline, explicit simulated state, three persistent tracking files, and inspection, diagnosis, verification, and resolution notes. The writeup describes the documented design and lab checks without claiming completion of every training tier, production deployment, or guaranteed enforcement by an AI prompt.

Two completed Tier 1 exercises dated May 2, 2026 show the workflow in use: a developer login repair and excessive `wheel` membership. Their excerpts come from retained human prompts and the completion log; personal administrator and host identifiers are replaced by `<lab_admin>` and `<lab_host>`. The fictional practice accounts are preserved. Render transcript text literally, retaining commands and output across both languages while translating their captions. Attribute the SSH test to the user's closure note, because no raw SSH success transcript survives; distinguish the surviving Bash account output from the initial shell described in the completion log. The wheel comparison supports a group-membership correction under the recorded lab sudo policy, not a complete audit of all possible privilege grants. AI mentoring remains explicit.

TanMar stays pinned first and Aquarium stays pinned second. Both carry the featured case-study label; the Linux ticket system uses the regular case-study label. Other case studies and entries in `current_projects` share descending `sortDate` order (`YYYY-MM`), ahead of the older project archive. Keep IDs and source URLs aligned in both locale files. Current project modals show code and optional journal links and omit the retired-demo notice used for archived projects.

Images are optimized copies of the user's public GitHub assets:

- RHEL hardware: [RHELheadless.png](https://github.com/traceadugar/ProjectJournal/blob/main/March%2026/Images/RHELheadless.png), saved as `public/images/portfolio/palehorse-lab/rhel-server.webp`.
- PaleHorse terminal: [palehorseintro.png](https://github.com/traceadugar/ProjectJournal/blob/main/April%2026/images/palehorseintro.png), saved as `public/images/portfolio/palehorse-intro-script/palehorseintro.webp`, with 480- and 960-pixel thumbnails. The gallery preserves the full screenshot. ASCII-art and font attribution remains in the linked [script journal](https://github.com/traceadugar/ProjectJournal/blob/main/April%2026/introScript.md).

## Portfolio refresh project

`current_projects` contains the October 2026 Portfolio Recovery & Seaside Redesign project. It opens the project details modal, with owner-supplied before screenshots paired with captures of the published seaside interface. It remains a project entry; it does not create a case-study route. Its description credits AI-assisted development and Trace's direction and review, and explains recovery, synchronized scene lighting, bilingual usability, optimization, and deployment verification.

The eight gallery images and two card thumbnails are self-hosted under `public/images/portfolio/portfolio-refresh/` and `public/images/thumbnails/`. The original before files remain preserved outside the website. Optimized copies retain the complete screenshot content; only the card thumbnail crops the current seaside hero. `imageCaptions` and `imageAlts` have one localized entry per image, identifying before/after, subject, and theme. New captures document the published interface before this project card was added, avoiding an image of the project embedding itself.

The two pinned case studies appear first: TanMar, then Aquarium. The October portfolio project, April Linux case study, and April PaleHorse script follow in date order. Keep `sortDate` machine-readable in both locales when adding newer work. The comparison gallery offers a full-size image link for inspecting long screenshots, as well as arrows, numbered selection, Escape dismissal, and focus restoration; on narrow screens the numbered row is hidden while previous/next controls remain available.

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
- Responsive WebP thumbnails reduce project card transfers. The original screenshots remain unchanged and are used in the gallery.

After changing a project's first screenshot, regenerate thumbnails before building:

```powershell
npm run optimize:images
npm run build
```

Thumbnails are checked into Git, so Netlify does not need to regenerate them.

## Interface polish

About's biography uses the card's available width with compact padding and paragraph spacing. The home introduction includes a direct Skills jump. Case-study contents links use client routing, focus the destination heading, and mark the selected fragment with `aria-current`. The sticky contents panel can scroll on short desktop screens; it returns to the normal page flow on mobile. Entries with GitHub sources include a contents shortcut to the source section.

A small seashell beside Back to top opens an optional footer note in either language. It stays closed until selected, keeps keyboard focus on its trigger, and closes with its button or Escape. This disclosure adds no animation, sound, storage, or network requests.

## Seaside background

The custom header shows a miniature California seaside town with Trace's stylized avatar in modern clothes. Light theme uses the sunny scene; dark theme uses its matching late-dusk scene. Only the ocean and a narrow band of surf washing up the sand move. The wave cycle uses periodic displacement, with an identical virtual start/end frame; the repeated endpoint is omitted from playback.

Desktop and mobile MP4 assets live in `public/images/backgrounds/`. Each video frame contains the day and dusk scenes side by side. A single video supplies both halves to the header canvas, keeping the waves at exactly the same point in the four-second cycle. The theme switch blends those halves over 1.2 seconds without replacing the video or seeking its playback clock. Reversing the switch during a fade starts from the current blend.

Pause freezes the current wave position and still permits a lighting fade. Reduced motion uses static posters without loading the video. Posters also provide a fallback if playback or canvas rendering fails. Animation controls are translated, and the visitor's pause preference persists locally. Mobile visitors receive a smaller video; canvas redraws skip unchanged frames when the theme is stable. The original generated artwork and prompts are retained in `assets/source/`.

## Seaside interface

The interface extends the artwork through warm sand surfaces, dark teal controls, terracotta accents, rounded panels, and lightly raised buttons. Dusk uses ocean and violet surfaces with lantern gold and lavender accents. Colors were sampled from the approved GIF frames and adjusted for readable contrast; the samples, coordinates, derivations, and contrast checks are retained in `assets/design/seaside-palette.json`. Edit the approved endpoint palettes in `src/themePalette.js` and their initial CSS fallbacks in `src/App.scss` rather than adding unrelated colors to individual components.

The page surfaces and scene lighting share one 1.2-second cosine fade in `SeasideBackground`. Each canvas paint sends its exact blend value to `themePalette.js`; posters use that same scalar. No independent CSS color timers can drift behind it. Text, links, and focus colors resolve against their actual page, card, chip, or wash background throughout the fade, because a continuous light-to-dark foreground crossing would briefly become unreadable. Primary button labels also account for the decorative sheen. Reversals start from the current blend, pause freezes only the waves, and reduced motion selects the final palette immediately. Palette tests sample 1,201 blend positions to check text and button contrast of at least 4.5:1 and control outlines of at least 3:1.

Project cards show a short description, technology chips, project status, and a clear details action; XLRX's delivered client work appears first within the archive. The gallery keeps the original screenshots, supports arrow keys and Escape, and restores focus to the card on closing. About uses a biography panel without a portrait or reserved photo column, followed by qualifications and contact actions. Qualification text is based on the supplied profile. Major section headers align their round symbol to the left of the title in a shared `section-title-row`; translated titles can wrap while the symbol keeps its size.

The sticky navigation offers page and section links, language selection, theme, and motion controls. `RouteNavigation` waits for content before following a section fragment and places keyboard focus at the destination. Navigation uses React Router links to preserve the shared video clock. A skip link, visible focus indicators, labelled icon controls, and touch targets of at least 44 pixels support keyboard and mobile use.

[Nunito Sans](https://fontsource.org/fonts/nunito-sans/about) is self-hosted as one 31 KB variable Latin WOFF2 file, sourced from Fontsource's npm package version 5.3.0. Its original SIL Open Font License is in `public/licenses/nunito-sans.txt`. Japanese uses the visitor's installed Japanese font fallback. Original rounded `shore-*` SVGs live in `Icon.js`; technology and social brand symbols retain the licensed local sprite. No external font or icon service is required.
