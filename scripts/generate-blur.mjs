/**
 * Generate blur data URLs for images
 */
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname } from 'path';

const INPUT_DIR = './public/img';

async function generateBlurDataURLs() {
  const files = await readdir(INPUT_DIR);
  const jpgFiles = files.filter(f => extname(f).toLowerCase() === '.jpg');

  console.log('// Blur data URLs for images\n');
  console.log('export const blurDataURLs = {');

  for (const file of jpgFiles) {
    const inputPath = join(INPUT_DIR, file);
    const name = file.replace('.jpg', '').replace(/-/g, '_');

    // Generate tiny placeholder (10px wide)
    const buffer = await sharp(inputPath)
      .resize(10, null, { withoutEnlargement: true })
      .jpeg({ quality: 50 })
      .toBuffer();

    const base64 = buffer.toString('base64');
    const dataURL = `data:image/jpeg;base64,${base64}`;

    console.log(`  "${file}": "${dataURL}",`);
  }

  console.log('};');
}

generateBlurDataURLs().catch(console.error);
