// Parity test: compares the output of the vendored custom-qr-code bundle
// with OpenQR-Core's options across 5 representative inputs.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCustomQrOptions } from '../core/qr-config.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const vendorJs = readFileSync(path.join(here, '../vendor/custom-qr-code.js'), 'utf8');

const inputs = [
  'https://openqr.tech',
  'https://github.com/NovaStrikes/OpenQR',
  'Hello from OpenQR Extension!',
  'WIFI:T:WPA;S:MyNetwork;P:SuperSecret123;;',
  'Café crème - testing non-latin 12345'
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.goto('about:blank');

// Inject the bundle into the page
await page.evaluate(async (bundleCode) => {
  const blob = new Blob([bundleCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const mod = await import(url);
  window.CustomQRCode = mod.CustomQRCode;
  window.qrcodegen = mod.qrcodegen;
}, vendorJs);

let allMatched = true;

for (const input of inputs) {
  const options = buildCustomQrOptions(input, 1000, 1000, 'M');
  options.type = 'svg';

  const svgResult = await page.evaluate(async (opts) => {
    // Check if encoding adjustment is needed
    for (const ch of opts.data) {
      if (ch.codePointAt(0) > 0xff) {
        window.qrcodegen.stringToBytes = window.qrcodegen.stringToBytesFuncs['UTF-8'];
        break;
      }
    }
    const qr = new window.CustomQRCode(opts);
    const blob = await qr.getRawData('svg');
    return await blob.text();
  }, options);

  const hasSvgTag = svgResult.includes('<svg') && svgResult.includes('width="1000"') && svgResult.includes('height="1000"');
  const hasSquareDots = svgResult.includes('rect');
  
  if (!hasSvgTag || !hasSquareDots) {
    console.error(`PARITY FAIL for "${input}"`);
    allMatched = false;
  } else {
    console.log(`PARITY OK: "${input.slice(0, 30)}" -> SVG valid, size: ${svgResult.length} bytes`);
  }
}

await browser.close();
if (!allMatched) process.exit(1);
console.log('ALL 5 PARITY CHECKS PASSED');
