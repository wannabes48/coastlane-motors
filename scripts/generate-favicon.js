const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH = path.join(__dirname, '..', 'app', 'icon-v2.svg');
const ICO_PATH = path.join(__dirname, '..', 'app', 'favicon.ico');

function createICO(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const dirSize = images.length * 16;
  let dataOffset = 6 + dirSize;

  const entries = [];
  const datas = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.data.length, 8);
    entry.writeUInt32LE(dataOffset, 12);

    entries.push(entry);
    datas.push(img.data);
    dataOffset += img.data.length;
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

async function main() {
  const svgBuffer = fs.readFileSync(SVG_PATH);
  const sizes = [16, 32, 48];
  const images = [];

  for (const size of sizes) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    images.push({ width: size, height: size, data: pngBuffer });
  }

  const ico = createICO(images);
  fs.writeFileSync(ICO_PATH, ico);
  console.log(`favicon.ico created (${ico.length} bytes) with sizes: ${sizes.join(', ')}px`);
}

main().catch(console.error);
