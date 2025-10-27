import sharp from 'sharp';
import { statSync } from 'fs';
import path from 'path';

async function run() {
  const input = path.resolve('public/og.png');
  const output = path.resolve('public/og-optimized.png');

  // Target social preview dimensions
  const width = 1200; // standard OG width
  const height = 630; // standard OG height

  await sharp(input)
    .resize(width, height, { fit: 'cover' })
    .png({ quality: 70, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);

  const originalSize = statSync(input).size;
  const newSize = statSync(output).size;

  console.log(`Original: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`Optimized: ${(newSize / 1024).toFixed(1)} KB`);
  if (newSize > 300 * 1024) {
    console.warn('Warning: optimized file still exceeds 300KB. Consider lowering quality or using JPEG.');
  } else {
    console.log('Success: optimized image is below 300KB.');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
