// Emit route-specific metadata for link unfurlers without executing browser JS.
const fs = require('node:fs');
const path = require('node:path');
const data = require('../public/res_primaryLanguage.json');
const origin = 'https://traceportfolio.netlify.app';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const template = fs.readFileSync('build/index.html', 'utf8');
for (const [route, title, description] of [
  ['', `Trace Dugar | ${data.basic_info.headline}`, data.basic_info.meta_description],
  ['about', 'About Trace Dugar | Systems & Infrastructure', data.basic_info.meta_description],
  ...data.case_studies.map(study => [`case-studies/${study.id}`, `${study.title} | Trace Dugar`, study.summary]),
]) {
  const url = `${origin}/${route}`;
  const html = template.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escape(description)}"/>`)
    .replace('</head>', `<link rel="canonical" href="${url}"/><meta property="og:type" content="website"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/><meta property="og:url" content="${url}"/><meta name="twitter:card" content="summary"/></head>`);
  const folder = path.join('build', route);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'index.html'), html);
}
