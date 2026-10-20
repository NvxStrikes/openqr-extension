/**
 * OpenQR preview window.
 *
 * Reads the one-time payload from chrome.storage.session, deletes it, and
 * renders the QR locally with the vendored custom-qr-code. User content is
 * only ever written to the page with .value / .textContent.
 *
 * License: MIT (c) 2026 NovaStrikes
 */

import { CustomQRCode, qrcodegen } from './vendor/custom-qr-code.js';
import { classifyContent, suggestFilename, ERROR_CORRECTION, MAX_CHARS } from './core/content.js';
import { buildCustomQrOptions, SVG_SIZE, PNG_SIZE, PREVIEW_SIZE } from './core/qr-config.js';
import { buildCustomizeUrl } from './core/handoff.js';

const KEY_PREFIX = 'handoff:';
const $ = (id) => document.getElementById(id);

const state = {
  content: null,      // result of classifyContent
  pngBlob: null,      // cached for Copy image (keeps the click's user activation)
  pngPromise: null,
  customizeUrl: null
};

// Strip the one-time key and any fragment from the address bar first.
const params = new URLSearchParams(location.search);
const handoffId = params.get('k');
history.replaceState(null, '', location.pathname);

/**
 * qrcode-generator's default byte encoding keeps only the low 8 bits of each
 * UTF-16 unit. That is what openqr.tech does today and is correct for
 * Latin-1 text, so it is kept for parity. Text with characters above U+00FF
 * would be corrupted that way, so it is encoded as UTF-8 instead.
 */
function chooseEncoding(data) {
  for (const ch of data) {
    if (ch.codePointAt(0) > 0xff) return 'UTF-8';
  }
  return 'default';
}

function makeQr(data, size, type) {
  qrcodegen.stringToBytes = qrcodegen.stringToBytesFuncs[chooseEncoding(data)];
  const options = buildCustomQrOptions(data, size, size, ERROR_CORRECTION);
  options.type = type;
  return new CustomQRCode(options);
}

async function svgBlob(data) {
  return makeQr(data, SVG_SIZE, 'svg').getRawData('svg');
}

async function pngBlob(data) {
  return makeQr(data, PNG_SIZE, 'canvas').getRawData('png');
}

function setStatus(text) {
  $('status').textContent = text;
}

function showError(text) {
  const el = $('error');
  el.textContent = text;
  el.hidden = false;
  $('qrCard').classList.add('is-error');
  $('qrCard').setAttribute('aria-label', 'No QR code: ' + text);
  $('qr').replaceChildren();
  $('qrPlaceholder').textContent = 'No QR code';
  $('qrPlaceholder').hidden = false;
}

function showWarnings(list) {
  const ul = $('warnings');
  ul.replaceChildren();
  for (const w of list) {
    const li = document.createElement('li');
    li.textContent = w;
    ul.appendChild(li);
  }
  ul.hidden = list.length === 0;
}

function selectedFormat() {
  return document.querySelector('input[name="format"]:checked').value;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function onDownload() {
  const c = state.content;
  if (!c || !c.ok) return;
  const fmt = selectedFormat();
  try {
    const blob = fmt === 'png' ? (state.pngBlob || await state.pngPromise) : await svgBlob(c.data);
    if (!blob) throw new Error('empty');
    const name = suggestFilename(c.type, c.data, fmt);
    triggerDownload(blob, name);
    setStatus('Saved ' + name);
  } catch (e) {
    setStatus('Could not create the file. Try again.');
  }
}

async function onCopy() {
  const c = state.content;
  if (!c || !c.ok) return;
  try {
    // Pass the blob (or its promise) straight to ClipboardItem so the write
    // happens within this click's user activation.
    const item = new ClipboardItem({ 'image/png': state.pngBlob || state.pngPromise });
    await navigator.clipboard.write([item]);
    setStatus('Image copied to the clipboard.');
  } catch (e) {
    setStatus('Copy failed: ' + (e && e.name ? e.name : 'error') + '. Use Download instead.');
  }
}

function openConfirm() {
  if (!state.customizeUrl) return;
  $('confirm').hidden = false;
  $('confirmTitle').focus();
}

function closeConfirm() {
  $('confirm').hidden = true;
  $('customizeBtn').focus();
}

async function onConfirmGo() {
  const url = state.customizeUrl;
  if (!url) return;
  try {
    await chrome.tabs.create({ url });
    window.close();
  } catch (e) {
    setStatus('Could not open openqr.tech.');
  }
}

async function readPayload() {
  if (!handoffId || !/^[0-9a-f-]{36}$/i.test(handoffId)) return null;
  const key = KEY_PREFIX + handoffId;
  const got = await chrome.storage.session.get(key);
  await chrome.storage.session.remove(key);
  return got[key] || null;
}

async function render() {
  let payload = null;
  try {
    payload = await readPayload();
  } catch (e) {
    payload = null;
  }
  if (!payload) {
    showError('This preview has expired. Right-click the page again to make a new QR code.');
    return;
  }

  const c = classifyContent(payload.source, payload.raw);
  state.content = c;

  $('content').value = c.data != null ? c.data : String(payload.raw || '').slice(0, MAX_CHARS + 50);
  if (c.type) {
    $('typeBadge').textContent = c.type === 'url' ? 'Web address' : 'Text';
    $('typeBadge').hidden = false;
  }
  if (c.chars) {
    $('charCount').textContent = c.chars.toLocaleString('en-US') + ' / ' + MAX_CHARS.toLocaleString('en-US') + ' characters';
  }
  showWarnings(c.warnings);

  if (!c.ok) {
    showError(c.error);
    return;
  }

  try {
    const preview = makeQr(c.data, PREVIEW_SIZE, 'svg');
    const holder = $('qr');
    holder.replaceChildren();
    preview.append(holder);
    if (preview._svgDrawingPromise) await preview._svgDrawingPromise;
    const svg = holder.querySelector('svg');
    if (svg) {
      svg.setAttribute('viewBox', '0 0 ' + PREVIEW_SIZE + ' ' + PREVIEW_SIZE);
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
    }
    $('qrPlaceholder').hidden = true;
    $('qrCard').setAttribute('aria-label', 'QR code for ' + (c.type === 'url' ? 'web address ' : 'text: ') + c.data.slice(0, 200));
  } catch (e) {
    showError('This content could not be turned into a QR code.');
    state.content = { ...c, ok: false };
    return;
  }

  state.pngPromise = pngBlob(c.data).then((b) => { state.pngBlob = b; return b; });

  $('downloadBtn').disabled = false;
  $('copyBtn').disabled = false;

  const handoff = buildCustomizeUrl(c.type, c.data);
  if (handoff.ok) {
    state.customizeUrl = handoff.url;
    $('customizeBtn').disabled = false;
  } else {
    $('customizeHint').textContent = handoff.error;
  }
}

$('downloadBtn').addEventListener('click', onDownload);
$('copyBtn').addEventListener('click', onCopy);
$('customizeBtn').addEventListener('click', openConfirm);
$('confirmGo').addEventListener('click', onConfirmGo);
$('confirmCancel').addEventListener('click', closeConfirm);

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('confirm').hidden) closeConfirm();
  else window.close();
});

render();
