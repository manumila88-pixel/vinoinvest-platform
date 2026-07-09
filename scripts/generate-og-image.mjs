/**
 * Generates frontend/public/og-image.png (1200x630) for Open Graph / Twitter cards.
 * No external dependencies — pure Node (zlib PNG encoding), same approach as generate-pwa-icons.mjs.
 * Convert to JPEG (referenced as /og-image.jpg) with:
 *   sips -s format jpeg -s formatOptions 90 frontend/public/og-image.png --out frontend/public/og-image.jpg
 * Colors: background #0b1220 (dark navy), foreground #C9A227 (gold).
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../frontend/public/og-image.png");

const W = 1200, H = 630;
const BG = [11, 18, 32];        // #0b1220
const GOLD = [201, 162, 39];    // #C9A227
const GRAY = [148, 163, 184];   // #94a3b8

// 5x7 bitmap font — only the glyphs we need
const FONT = {
  V: ["10001","10001","10001","10001","01010","01010","00100"],
  I: ["11111","00100","00100","00100","00100","00100","11111"],
  N: ["10001","11001","10101","10011","10001","10001","10001"],
  O: ["01110","10001","10001","10001","10001","10001","01110"],
  E: ["11111","10000","10000","11110","10000","10000","11111"],
  S: ["01111","10000","10000","01110","00001","00001","11110"],
  T: ["11111","00100","00100","00100","00100","00100","00100"],
  F: ["11111","10000","10000","11110","10000","10000","10000"],
  W: ["10001","10001","10001","10101","10101","10101","01010"],
  L: ["10000","10000","10000","10000","10000","10000","11111"],
  G: ["01110","10001","10000","10111","10001","10001","01110"],
  C: ["01110","10001","10000","10000","10000","10001","01110"],
  " ": ["00000","00000","00000","00000","00000","00000","00000"],
};

const px = new Uint8Array(W * H * 3);
function set(x, y, [r, g, b]) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r; px[i + 1] = g; px[i + 2] = b;
}
function rect(x0, y0, w, h, c) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(x, y, c);
}
function textWidth(s, scale) { return s.length * 6 * scale - scale; }
function drawText(s, cx, y0, scale, color) {
  let x0 = Math.round(cx - textWidth(s, scale) / 2);
  for (const ch of s) {
    const glyph = FONT[ch] || FONT[" "];
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 5; c++)
        if (glyph[r][c] === "1") rect(x0 + c * scale, y0 + r * scale, scale, scale, color);
    x0 += 6 * scale;
  }
}

// Background + subtle gold border
rect(0, 0, W, H, BG);
rect(0, 0, W, 6, GOLD); rect(0, H - 6, W, 6, GOLD);
rect(0, 0, 6, H, GOLD); rect(W - 6, 0, 6, H, GOLD);

// Title, rule, subtitle
drawText("VINOINVEST", W / 2, 200, 14, GOLD);
rect(Math.round(W / 2 - 200), 340, 400, 4, GOLD);
drawText("FINE WINE INTELLIGENCE", W / 2, 390, 5, GRAY);

// PNG encoding
function crc32(buf) {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
const raw = Buffer.alloc(H * (W * 3 + 1));
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0; // filter: none
  Buffer.from(px.buffer, y * W * 3, W * 3).copy(raw, y * (W * 3 + 1) + 1);
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);
writeFileSync(OUT, png);
console.log(`✅ og-image.png ${W}x${H} → ${OUT}`);
