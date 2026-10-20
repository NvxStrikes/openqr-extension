// Renders icons/icon-source.svg (the OpenQR favicon from OpenQR-Core
// assets/favicon.svg) to the PNG sizes Chrome needs. Dev-only.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(path.join(root, 'icons/icon-source.svg'), 'utf8');
const sizes = [16, 32, 48, 128];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.goto('about:blank');

for (const s of sizes) {
  // Chrome Web Store guidance: 128px icon = 96px artwork + 16px transparent padding.
  const pad = s === 128 ? 16 : 0;
  const art = s - pad * 2;
  const base64Png = await page.evaluate(async ({ svgText, s, pad, art }) => {
    const canvas = document.createElement('canvas');
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    ctx.drawImage(img, pad, pad, art, art);
    URL.revokeObjectURL(url);
    return canvas.toDataURL('image/png').split(',')[1];
  }, { svgText: svg, s, pad, art });

  const buf = Buffer.from(base64Png, 'base64');
  writeFileSync(path.join(root, `icons/icon-${s}.png`), buf);
  console.log(`icons/icon-${s}.png`, buf.length, 'bytes');
}
await browser.close();
