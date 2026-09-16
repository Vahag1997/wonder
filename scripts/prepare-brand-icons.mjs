import sharp from "sharp";
import { writeFile } from "node:fs/promises";

// Deterministic delivery-size exports of the approved generated mark.
const source = new URL("../public/images/brand/magicbook-symbol.png", import.meta.url);
const app = new URL("../src/app/", import.meta.url);
const png = (size) => sharp(source.pathname).resize(size, size).png().toBuffer();
await writeFile(new URL("icon.png", app), await png(192));
await sharp(source.pathname).resize(180, 180).flatten({ background: "#ffffff" }).png().toFile(new URL("apple-icon.png", app).pathname);
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((bytes, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(bytes.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += bytes.length;
});
await writeFile(new URL("favicon.ico", app), Buffer.concat([header, ...images]));
console.log("Exported 16/32/48px ICO, 192px browser PNG and 180px Apple icon.");
