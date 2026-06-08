/**
 * Generates minimal PNG icons for VinoInvest PWA.
 * No external dependencies — uses only Node.js built-ins (zlib + Buffer).
 * Colors: background #0b1220 (dark navy), foreground #C9A227 (gold)
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../frontend/public");

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function writeU32(buf, offset, val) {
  buf[offset]     = (val >>> 24) & 0xff;
  buf[offset + 1] = (val >>> 16) & 0xff;
  buf[offset + 2] = (val >>> 8)  & 0xff;
  buf[offset + 3] =  val         & 0xff;
}

function chunk(type, data) {
  const typeBuf  = Buffer.from(type);
  const dataLen  = data.length;
  const out = Buffer.alloc(4 + 4 + dataLen + 4);
  writeU32(out, 0, dataLen);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  writeU32(out, 8 + dataLen, crc);
  return out;
}

function makePng(size) {
  const BG  = [0x0b, 0x12, 0x20]; // #0b1220
  const FG  = [0xC9, 0xA2, 0x27]; // #C9A227

  // Draw a simple wine glass silhouette in the centre
  const cx = size / 2, cy = size / 2;
  const radius = size * 0.35;
  const stemW  = Math.max(2, Math.round(size * 0.04));

  function inCircle(x, y) {
    const dx = x - cx, dy = y - cy * 0.72;
    return dx * dx + dy * dy <= radius * radius * 0.52;
  }
  function inStem(x, y) {
    const halfW = stemW / 2;
    return x >= cx - halfW && x <= cx + halfW && y > cy * 0.95 && y < cy * 1.45;
  }
  function inBase(x, y) {
    const bW = size * 0.3, bH = Math.max(3, size * 0.04);
    return Math.abs(x - cx) <= bW / 2 && Math.abs(y - cy * 1.45) <= bH;
  }

  const raw = [];
  for (let y = 0; y < size; y++) {
    raw.push(0); // filter type: None
    for (let x = 0; x < size; x++) {
      const isGold = inCircle(x, y) || inStem(x, y) || inBase(x, y);
      raw.push(...(isGold ? FG : BG));
    }
  }

  const rawBuf     = Buffer.from(raw);
  const compressed = deflateSync(rawBuf);

  const ihdr = Buffer.alloc(13);
  writeU32(ihdr, 0, size);
  writeU32(ihdr, 4, size);
  ihdr[8]  = 8;  // bit depth
  ihdr[9]  = 2;  // color type: RGB
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  const png  = makePng(size);
  const path = join(OUT, `icon-${size}.png`);
  writeFileSync(path, png);
  console.log(`✓ Generated ${path} (${png.length} bytes)`);
}
console.log("PWA icons generated.");
