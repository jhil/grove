/**
 * Image optimization script
 * Resizes images to max 1920px width and compresses them
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const INPUT_DIR = './public/img';
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImages() {
  const files = await readdir(INPUT_DIR);
  const jpgFiles = files.filter(f => extname(f).toLowerCase() === '.jpg');

  console.log(`Found ${jpgFiles.length} images to optimize\n`);

  for (const file of jpgFiles) {
    const inputPath = join(INPUT_DIR, file);
    const outputPath = inputPath; // Overwrite original

    // Get original stats
    const originalStats = await stat(inputPath);
    const originalSize = originalStats.size;

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();

    console.log(`Processing: ${file}`);
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

    // Skip if already small enough
    if (metadata.width <= MAX_WIDTH && originalSize < 500000) {
      console.log(`  Skipping: already optimized\n`);
      continue;
    }

    // Optimize
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({
        quality: QUALITY,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath + '.tmp');

    // Get new stats
    const newStats = await stat(outputPath + '.tmp');
    const newSize = newStats.size;
    const newMetadata = await sharp(outputPath + '.tmp').metadata();

    // Replace original
    await import('fs').then(fs => {
      fs.renameSync(outputPath + '.tmp', outputPath);
    });

    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(`  Optimized: ${newMetadata.width}x${newMetadata.height}, ${(newSize / 1024).toFixed(0)} KB`);
    console.log(`  Saved: ${savings}%\n`);
  }

  console.log('Done!');
}

optimizeImages().catch(console.error);
