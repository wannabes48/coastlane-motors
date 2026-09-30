// Script to generate favicon.ico from icon.svg using sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH = path.join(__dirname, '..', 'app', 'icon.svg');
const ICO_PATH = path.join(__dirname, '..', 'app', 'favicon.ico');

// ICO file format helpers
function createICO(images) {
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);           // reserved
  header.writeUInt16LE(1, 2);           // type: 1 = ICO
  header.writeUInt16LE(images.length, 4); // number of images

  // Each directory entry: 16 bytes
  const dirSize = images.length * 16;
  let dataOffset = 6 + dirSize;

  const entries = [];
  const datas = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);   // width (0 = 256)
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1); // height
    entry.writeUInt8(0, 2);              // color palette
    entry.writeUInt8(0, 3);              // reserved
    entry.writeUInt16LE(1, 4);           // color planes
    entry.writeUInt16LE(32, 6);          // bits per pixel
    entry.writeUInt32LE(img.data.length, 8);  // image data size
    entry.writeUInt32LE(dataOffset, 12);      // offset to image data

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
  console.log(`favicon.ico created at ${ICO_PATH} (${ico.length} bytes) with sizes: ${sizes.join(', ')}px`);
}

main().catch(console.error);
