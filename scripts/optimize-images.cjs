const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');

async function main() {
  const data = JSON.parse(await fs.readFile(path.join(root, 'public/res_primaryLanguage.json'), 'utf8'));
  const shared = JSON.parse(await fs.readFile(path.join(root, 'public/portfolio_shared_data.json'), 'utf8'));
  const target = path.join(root, 'public/images/thumbnails');
  await fs.mkdir(target, {recursive: true});
  let originalBytes = 0;
  let thumbnailBytes = 0;
  for (const project of data.projects) {
    const original = path.join(root, 'public', project.images[0]);
    originalBytes += (await fs.stat(original)).size;
    for (const width of [480, 960]) {
      const output = path.join(target, `${project.id}-${width}.webp`);
      await sharp(original).rotate().resize({width, withoutEnlargement: true}).webp({quality: 82}).toFile(output);
      if (width === 960) thumbnailBytes += (await fs.stat(output)).size;
    }
  }
  // The original profile and all gallery screenshots remain untouched.
  await sharp(path.join(root, 'public/images', shared.basic_info.image)).rotate()
    .resize({width: 400, withoutEnlargement: true}).webp({quality: 85})
    .toFile(path.join(target, 'profile.webp'));
  console.log(`Project card images: ${originalBytes} original bytes; ${thumbnailBytes} bytes at 960px.`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
