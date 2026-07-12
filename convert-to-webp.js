#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const assetsDir = path.join(__dirname, 'public/assets');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

console.log(`Converting ${files.length} PNG files to WebP...\n`);

let completed = 0;
files.forEach(file => {
  const inputPath = path.join(assetsDir, file);
  const outputPath = path.join(assetsDir, file.replace('.png', '.webp'));

  sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(() => {
      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = (((inputSize - outputSize) / inputSize) * 100).toFixed(1);
      console.log(`✓ ${file} → ${path.basename(outputPath)} (saved ${savings}%)`);
      completed++;
      if(completed === files.length) {
        console.log(`\n✅ All ${files.length} files converted!`);
        updateReferences();
      }
    })
    .catch(err => console.error(`✗ Error converting ${file}:`, err.message));
});

function updateReferences() {
  console.log('\nUpdating file references...');
  const srcDir = path.join(__dirname, 'src');
  updateFilesInDir(srcDir);
  console.log('✅ Done! Update complete.');
}

function updateFilesInDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      updateFilesInDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const updated = content.replace(/\.png(['"`])/g, '.webp$1');
      if (updated !== content) {
        fs.writeFileSync(filePath, updated);
        console.log(`  Updated ${filePath}`);
      }
    }
  });
}
