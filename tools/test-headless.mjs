// Headless checks with the real unpacked extension loaded in Playwright's
// Chromium. Native right-click menus cannot be driven by Playwright, so the
// menu click is simulated by calling handleMenuClick() inside the service
// worker with the same `info` fields Chrome passes. Everything after that
// (storage handoff, popup window, rendering, downloads, copy, Customize) is
// the real extension code.
//
// Run: node test-headless.mjs   (OUT_DIR=<dir> to choose where outputs go)
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { parseHandoffFragment } from '../core/handoff.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const extDir = path.resolve(here, '..');
const outDir = path.resolve(process.env.OUT_DIR || path.join(here, 'out'));
mkdirSync(outDir, { recursive: true });

let failures = 0;
const results = [];
function check(name, cond, detail = '') {
  results.push(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' - ' + detail : ''}`);
  if (!cond) failures++;
}

function decodePng(buf) {
  const png = PNG.sync.read(buf);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return { width: png.width, height: png.height, code };
}

function expectedBytes(data) {
  for (const ch of data) if (ch.codePointAt(0) > 0xff) return [...Buffer.from(data, 'utf8')];
  return [...data].map(c => c.charCodeAt(0));
}

const userDataDir = path.join(outDir, 'profile-' + Date.now());
const context = await chromium.launchPersistentContext(userDataDir, {
  channel: 'msedge',
  headless: false,
  acceptDownloads: true,
  args: ['--headless=new', `--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`]
});

// Never touch the real website from tests.
await context.route('https://openqr.tech/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' }));

let [sw] = context.serviceWorkers();
if (!sw) sw = await context.waitForEvent('serviceworker');
const extId = new URL(sw.url()).host;
check('extension loaded, service worker running', !!extId, 'id ' + extId);

const consoleErrors = [];
context.on('page', p => {
  p.on('console', m => {
    if (m.type() === 'error' && p.url().startsWith(`chrome-extension://${extId}`)) {
      consoleErrors.push(`${p.url().split('/').pop()}: ${m.text()}`);
    }
  });
  p.on('pageerror', e => {
    if (p.url().startsWith(`chrome-extension://${extId}`)) {
      consoleErrors.push(`${p.url().split('/').pop()}: ${String(e)}`);
    }
  });
});

// Opens the preview like background.js does, but in a tab we control
// (fixed viewport and color scheme for screenshots).
async function openPreview(source, raw, { colorScheme = 'light' } = {}) {
  const id = await sw.evaluate(async ({ source, raw }) => {
    const id = crypto.randomUUID();
    await chrome.storage.session.set({ ['handoff:' + id]: { source, raw, createdAt: Date.now() } });
    return id;
  }, { source, raw });
  const page = await context.newPage();
  await page.emulateMedia({ colorScheme });
  await page.setViewportSize({ width: 380, height: 640 });
  await page.goto(`chrome-extension://${extId}/preview.html?k=${id}`);
  await page.waitForFunction(() => {
    const ph = document.getElementById('qrPlaceholder');
    return ph.hidden || ph.textContent === 'No QR code';
  });
  return page;
}

// 1. Real path: simulated menu click -> background opens popup window.
{
  const popupPromise = context.waitForEvent('page');
  await sw.evaluate(() => handleMenuClick({ menuItemId: 'openqr-selection', selectionText: 'Hello from a selection' }));
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForFunction(() => document.getElementById('qrPlaceholder').hidden);
  const url = popup.url();
  check('popup URL carries no user content', !url.includes('Hello') && !url.includes('selection'), url.replace(extId, '<id>'));
  check('popup URL cleaned by replaceState', !url.includes('?') && !url.includes('#'));
  check('popup shows the selection', await popup.inputValue('#content') === 'Hello from a selection');
  const left = await sw.evaluate(async () => Object.keys(await chrome.storage.session.get(null)));
  check('storage.session handoff key deleted after read', left.length === 0, JSON.stringify(left));
  const win = await sw.evaluate(async () => (await chrome.windows.getAll({ windowTypes: ['popup'] })).map(w => w.type));
  check('opened as a popup window', win.includes('popup'), JSON.stringify(win));
  // Reload = key is gone -> expired message, no content leak.
  await popup.reload();
  await popup.waitForFunction(() => !document.getElementById('error').hidden);
  check('reloaded preview shows expired message', /expired/.test(await popup.textContent('#error')));
  await popup.close();
}

// Same simulated click path for page and link sources.
for (const [info, expected] of [
  [{ menuItemId: 'openqr-page', pageUrl: 'https://example.com/page?a=1' }, 'https://example.com/page?a=1'],
  [{ menuItemId: 'openqr-link', linkUrl: 'https://example.org/link', pageUrl: 'https://x.test/' }, 'https://example.org/link']
]) {
  const popupPromise = context.waitForEvent('page');
  await sw.evaluate((i) => handleMenuClick(i), info);
  const popup = await popupPromise;
  await popup.waitForFunction(() => document.getElementById('qrPlaceholder').hidden);
  check(`${info.menuItemId} encodes ${expected}`, await popup.inputValue('#content') === expected);
  check(`${info.menuItemId} badge`, (await popup.textContent('#typeBadge')) === 'Web address');
  await popup.close();
}

// 2. Downloads: SVG (default) and PNG, decoded back with jsQR.
const decodeCases = [
  ['page', 'https://example.com/', 'https://example.com/'],
  ['selection', 'openqr.tech', 'https://openqr.tech'],
  ['selection', 'Plain text with spaces', 'Plain text with spaces'],
  ['selection', 'Café crème', 'Café crème'],
  ['selection', 'سلام دنیا یہ اردو ہے', 'سلام دنیا یہ اردو ہے']
];
for (const [source, raw, expected] of decodeCases) {
  const page = await openPreview(source, raw);
  // SVG
  let dl = page.waitForEvent('download');
  await page.click('#downloadBtn');
  let d = await dl;
  const svgName = d.suggestedFilename();
  const svgPath = path.join(outDir, svgName);
  await d.saveAs(svgPath);
  const svg = readFileSync(svgPath, 'utf8');
  check(`SVG file for "${expected}"`, svg.startsWith('<?xml') && /<svg[^>]+width="1000"[^>]+height="1000"/.test(svg) && /^openqr-[a-z0-9-]+-\d{8}-\d{6}\.svg$/.test(svgName), svgName + ', ' + svg.length + ' bytes');
  // PNG
  await page.check('input[name="format"][value="png"]');
  dl = page.waitForEvent('download');
  await page.click('#downloadBtn');
  d = await dl;
  const pngPath = path.join(outDir, d.suggestedFilename());
  await d.saveAs(pngPath);
  const { width, height, code } = decodePng(readFileSync(pngPath));
  check(`PNG 1000x1000 for "${expected}"`, width === 1000 && height === 1000, `${width}x${height}`);
  const ok = code && JSON.stringify(code.binaryData) === JSON.stringify(expectedBytes(expected));
  check(`PNG decodes back to "${expected}"`, !!ok, code ? 'decoded ' + (code.data || '').slice(0, 60) : 'not decodable');
  // Rasterize the SVG on a solid white canvas and decode it.
  const svgPng = await page.evaluate(async (svgText) => {
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const c = document.createElement('canvas');
    c.width = 1000;
    c.height = 1000;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1000);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    return c.toDataURL('image/png').split(',')[1];
  }, svg);
  const s = decodePng(Buffer.from(svgPng, 'base64'));
  check(`SVG decodes back to "${expected}"`, !!s.code && JSON.stringify(s.code.binaryData) === JSON.stringify(expectedBytes(expected)));
  await page.close();
}

// 3. Limits and warnings.
{
  const p = await openPreview('selection', 'x'.repeat(2001));
  check('2,001 chars refused', /2,001 characters\. The limit is 2,000/.test(await p.textContent('#error')));
  check('2,001 chars: buttons disabled', await p.isDisabled('#downloadBtn') && await p.isDisabled('#copyBtn') && await p.isDisabled('#customizeBtn'));
  await p.screenshot({ path: path.join(outDir, 'preview-too-long-light.png') });
  await p.close();
}
{
  const p = await openPreview('selection', 'word '.repeat(120) + 'end');
  check('>500 chars shows dense warning', /hard to scan/.test(await p.textContent('#warnings')) && await p.isEnabled('#downloadBtn'));
  await p.close();
}
{
  const p = await openPreview('selection', 'x'.repeat(2000));
  check('exactly 2,000 chars renders', await p.isHidden('#error') && await p.isEnabled('#downloadBtn'));
  await p.close();
}
{
  const p = await openPreview('selection', 'javascript:alert(document.cookie)');
  const warn = await p.textContent('#warnings');
  check('javascript: selection -> text QR + warning', (await p.textContent('#typeBadge')) === 'Text' && /scanners may handle it unpredictably/.test(warn));
  check('javascript: payload not executed or injected', await p.evaluate(() => !document.querySelector('script:not([src])')));
  await p.close();
}
{
  const p = await openPreview('selection', '<img src=x onerror=alert(1)>');
  check('HTML in selection stays text', await p.evaluate(() => document.querySelectorAll('img').length === 1)); // only the logo
  await p.close();
}
{
  const p = await openPreview('selection', '   ');
  check('empty selection message', /No text was selected/.test(await p.textContent('#error')));
  await p.close();
}
{
  const p = await openPreview('link', 'javascript:alert(1)');
  check('javascript: link refused', /Only http\(s\)/.test(await p.textContent('#error')));
  await p.close();
}

// 4. Copy image WITHOUT clipboardWrite permission.
{
  const p = await openPreview('page', 'https://example.com/copy-test');
  await p.waitForFunction(() => true);
  await p.bringToFront();
  await p.click('#copyBtn');
  await p.waitForFunction(() => document.getElementById('status').textContent !== '');
  const status = await p.textContent('#status');
  check('Copy image succeeds without clipboardWrite', /copied/i.test(status), status);
  // Read it back via a regular page with clipboard-read permission.
  const reader = await context.newPage();
  await reader.goto('https://example.com');
  await context.grantPermissions(['clipboard-read'], { origin: 'https://example.com' });
  const b64 = await reader.evaluate(async () => {
    const items = await navigator.clipboard.read();
    const blob = await items[0].getType('image/png');
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (const x of buf) s += String.fromCharCode(x);
    return btoa(s);
  }).catch(e => 'ERR ' + e);
  await reader.close();
  if (b64.startsWith('ERR')) check('clipboard holds the PNG', false, b64);
  else {
    const r = decodePng(Buffer.from(b64, 'base64'));
    check('clipboard holds the PNG and it decodes', !!r.code && r.code.data === 'https://example.com/copy-test', `${r.width}x${r.height}`);
  }
  await p.close();
}

// 5. Customize: notice, then fragment-only handoff.
{
  const p = await openPreview('selection', 'Customize me: سلام');
  await p.click('#customizeBtn');
  const notice = (await p.textContent('#confirmText')).replace(/\s+/g, ' ').trim();
  check('notice text exact', notice === 'Customize opens openqr.tech. Web addresses are checked for safety by our server and Google Safe Browsing, as described in the Privacy Policy.', notice);
  await p.screenshot({ path: path.join(outDir, 'preview-customize-notice-light.png') });
  const tabPromise = context.waitForEvent('page');
  await p.click('#confirmGo');
  const tab = await tabPromise;
  await tab.waitForURL(u => u.href.includes('openqr.tech'));
  const url = tab.url();
  const u = new URL(url);
  check('Customize URL: origin, no query', u.origin === 'https://openqr.tech' && u.search === '' && u.hash.startsWith('#oqr=1.'), url.slice(0, 60) + '...');
  check('Customize fragment decodes to payload', JSON.stringify(parseHandoffFragment(u.hash)) === JSON.stringify({ type: 'text', data: 'Customize me: سلام' }));
  await tab.close();
}

// 6. Screenshots, light and dark.
for (const scheme of ['light', 'dark']) {
  const p = await openPreview('page', 'https://openqr.tech/features', { colorScheme: scheme });
  await p.screenshot({ path: path.join(outDir, `preview-url-${scheme}.png`) });
  await p.close();
  const q = await openPreview('selection', 'javascript:void(0) ' + 'and some long selected text '.repeat(20), { colorScheme: scheme });
  await q.screenshot({ path: path.join(outDir, `preview-warnings-${scheme}.png`) });
  await q.close();
}

// 7. Keyboard: Tab order reaches every control; Escape closes confirm.
{
  const p = await openPreview('page', 'https://example.com/');
  const order = [];
  for (let i = 0; i < 8; i++) {
    await p.keyboard.press('Tab');
    order.push(await p.evaluate(() => document.activeElement.id || document.activeElement.value || document.activeElement.tagName));
  }
  check('Tab order', ['content', 'svg', 'downloadBtn', 'copyBtn', 'customizeBtn'].every(x => order.includes(x)), order.join(' > '));
  await p.focus('#customizeBtn');
  await p.keyboard.press('Enter');
  check('Enter opens confirm and focuses heading', await p.evaluate(() => document.activeElement.id === 'confirmTitle'));
  await p.keyboard.press('Escape');
  check('Escape closes confirm, focus returns', await p.isHidden('#confirm') && await p.evaluate(() => document.activeElement.id === 'customizeBtn'));
  await p.close();
}

const csp = consoleErrors.filter(e => /Content Security Policy|Refused to/i.test(e));
check('no CSP violations', csp.length === 0, csp.slice(0, 3).join(' | '));
check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await context.close();
writeFileSync(path.join(outDir, 'results.txt'), results.join('\n') + '\n');
console.log(results.join('\n'));
console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
process.exit(failures ? 1 : 0);
