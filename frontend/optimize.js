import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('src/assets/images');
const buildingIn = path.join(imagesDir, 'building.jpg');
const buildingOut = path.join(imagesDir, 'building.webp');
const logoIn = path.join(imagesDir, 'logo.png');
const logoOut = path.join(imagesDir, 'logo.webp');

async function optimize() {
  try {
    if (fs.existsSync(buildingIn)) {
      await sharp(buildingIn)
        .resize({ width: 1682, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(buildingOut);
      console.log('Optimized building.jpg to building.webp');
      fs.unlinkSync(buildingIn);
    }
    if (fs.existsSync(logoIn)) {
      await sharp(logoIn)
        .resize({ width: 128, withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(logoOut);
      console.log('Optimized logo.png to logo.webp');
      fs.unlinkSync(logoIn);
    }
  } catch (err) {
    console.error('Error optimizing images:', err);
  }
}

optimize();
