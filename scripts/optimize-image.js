#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const src = path.join(root, 'src', 'assets', 'images', 'sidebar-logo.png');
const outWebp = path.join(root, 'src', 'assets', 'images', 'sidebar-logo.webp');
const outPng = path.join(root, 'src', 'assets', 'images', 'sidebar-logo.opt.png');

async function run() {
  if (!fs.existsSync(src)) {
    console.error('Source image not found at', src);
    process.exit(1);
  }

  try {
    console.log('Generating optimized WebP ->', outWebp);
    await sharp(src)
      .rotate()
      .webp({ quality: 80 })
      .toFile(outWebp);

    console.log('Generating optimized PNG (recompressed) ->', outPng);
    await sharp(src)
      .rotate()
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outPng);

    console.log('Optimization complete. Consider replacing the original PNG with the WebP or the optimized PNG.');
    process.exit(0);
  } catch (err) {
    console.error('Image optimization failed:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

run();
