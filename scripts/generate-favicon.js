const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CLIENT_TRANSPARENT_IMAGE = 'C:/Users/Dorah Siro/.gemini/antigravity/brain/bba84a78-327f-4e8a-91a5-67fd697873b6/.user_uploaded/media_1793977332780_17c8b842.png';

function createICO(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4); // count

  const dirSize = images.length * 16;
  let dataOffset = 6 + dirSize;

  const entries = [];
  const datas = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // palette colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel (32-bit RGBA)
    entry.writeUInt32LE(img.data.length, 8); // size of image data
    entry.writeUInt32LE(dataOffset, 12); // offset of image data

    entries.push(entry);
    datas.push(img.data);
    dataOffset += img.data.length;
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

async function main() {
  const rootDir = path.join(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'app');

  // Clean up any old unused test files in public
  const unusedFiles = [
    'logo-emblem.png',
    'logo-horizontal.png',
    'logo-square.png',
    'logo-text.png',
    'logo.jpg'
  ];
  for (const file of unusedFiles) {
    const p = path.join(publicDir, file);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`Cleaned up obsolete test file: ${file}`);
    }
  }

  // 1. Copy transparent master client logo into public
  fs.copyFileSync(CLIENT_TRANSPARENT_IMAGE, path.join(publicDir, 'logo.png'));
  console.log('✓ Copied transparent master logo to public/logo.png');

  // 2. Generate transparent horizontal brand logo (Car emblem + VORBACK MOTORS):
  // Exact bounds: left 23, top 121, width 458, height 206
  await sharp(CLIENT_TRANSPARENT_IMAGE)
    .extract({ left: 23, top: 121, width: 458, height: 206 })
    .png()
    .toFile(path.join(publicDir, 'logo-brand.png'));
  console.log('✓ Generated transparent public/logo-brand.png');

  // 3. Create square emblem (Car + Speedometer Arc centered on 512x512 #0F1923 canvas):
  // Car bounds: left 24, top 121, width 456, height 153
  const emblem = await sharp(CLIENT_TRANSPARENT_IMAGE)
    .extract({ left: 24, top: 121, width: 456, height: 153 })
    .resize(460, null, { fit: 'contain' })
    .ensureAlpha()
    .png()
    .toBuffer();

  const emblemSquare = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 25, b: 35, alpha: 1 } // #0F1923 Vorback ink
    }
  })
    .composite([{ input: emblem, gravity: 'center' }])
    .ensureAlpha()
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), emblemSquare);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), emblemSquare);
  fs.writeFileSync(path.join(appDir, 'icon.png'), emblemSquare);
  console.log('✓ Generated square 512x512 icon.png and icon-512.png');

  // 4. Apple Touch Icon (180x180)
  const appleIcon = await sharp(emblemSquare)
    .resize(180, 180, { fit: 'contain' })
    .ensureAlpha()
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
  fs.writeFileSync(path.join(appDir, 'apple-touch-icon.png'), appleIcon);
  console.log('✓ Generated apple-touch-icon.png');

  // 5. icon-v3.png for Google Search and web browsers (48x48)
  const icon48 = await sharp(emblemSquare)
    .resize(48, 48, { fit: 'contain' })
    .ensureAlpha()
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-v3.png'), icon48);
  fs.writeFileSync(path.join(appDir, 'icon-v3.png'), icon48);

  const icon192 = await sharp(emblemSquare)
    .resize(192, 192, { fit: 'contain' })
    .ensureAlpha()
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  console.log('✓ Generated icon-v3.png and icon-192.png');

  // 6. Generate multi-size favicon.ico (16, 32, 48) - strictly RGBA 32-bit
  const icoSizes = [16, 32, 48];
  const icoImages = [];
  for (const s of icoSizes) {
    const buf = await sharp(emblemSquare)
      .resize(s, s, { fit: 'contain' })
      .ensureAlpha()
      .png()
      .toBuffer();
    icoImages.push({ width: s, height: s, data: buf });
  }
  const icoData = createICO(icoImages);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoData);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoData);
  console.log(`✓ Generated favicon.ico (${icoData.length} bytes)`);

  // 7. Generate icon-v3.svg with embedded base64
  const b64 = icon192.toString('base64');
  const svg = `<svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="8" fill="#0F1923"/>
  <image href="data:image/png;base64,${b64}" x="0" y="0" width="48" height="48"/>
</svg>
`;
  fs.writeFileSync(path.join(appDir, 'icon-v3.svg'), svg);
  fs.writeFileSync(path.join(publicDir, 'icon-v3.svg'), svg);
  console.log('✓ Generated icon-v3.svg');
}

main().catch(console.error);
