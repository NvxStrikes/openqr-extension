/**
 * Content rules for the OpenQR extension: what gets encoded, as which type,
 * and which limits and warnings apply. Pure functions, no DOM, no network.
 *
 * License: MIT (c) 2026 NovaStrikes
 */

import { normalizeUrlInput } from './normalize.js';

export const MAX_CHARS = 2000;          // hard refusal above this
export const WARN_CHARS = 500;          // "dense code" warning above this
export const ERROR_CORRECTION = 'M';    // same default as openqr.tech
// Byte-mode capacity of a version 40 QR code at error correction M.
// Non-Latin text is UTF-8 encoded, so 2,000 characters can exceed this.
export const MAX_BYTES_M = 2331;

const RISKY_SCHEMES = ['javascript', 'data', 'vbscript'];

export function charCount(str) {
  let n = 0;
  for (const _ of str) n++;  // count code points, not UTF-16 units
  return n;
}

export function utf8Length(str) {
  return new TextEncoder().encode(str).length;
}

/**
 * Returns the risky scheme a string starts with, or null. Browsers ignore
 * whitespace and control characters inside a scheme ("java\nscript:"), so
 * they are stripped before checking.
 */
export function riskyScheme(str) {
  const squashed = String(str).replace(/[\u0000-\u0020\u007f]/g, '').toLowerCase();
  for (const s of RISKY_SCHEMES) {
    if (squashed.startsWith(s + ':')) return s;
  }
  return null;
}

/**
 * Decide what to encode.
 * @param {'page'|'link'|'selection'} source
 * @param {string} raw
 * @returns {{ ok: boolean, type: 'url'|'text'|null, data: string|null,
 *             error: string|null, warnings: string[], chars: number }}
 */
export function classifyContent(source, raw) {
  const result = { ok: false, type: null, data: null, error: null, warnings: [], chars: 0 };
  const trimmed = raw == null ? '' : String(raw).trim();

  if (!trimmed) {
    result.error = source === 'selection'
      ? 'No text was selected. Select some text and try again.'
      : 'There is no address to encode.';
    return result;
  }

  if (source === 'page' || source === 'link') {
    const norm = normalizeUrlInput(trimmed);
    if (!norm.ok) {
      result.error = (norm.reason || 'Please enter a valid URL') +
        '. This address cannot be turned into a web address QR code.';
      return result;
    }
    result.type = 'url';
    result.data = norm.url;
  } else if (source === 'selection') {
    const scheme = riskyScheme(trimmed);
    // A web address never contains whitespace in the middle. The URL parser
    // silently drops tabs and newlines, so check before normalizing.
    const looksLikeOneToken = !/\s/.test(trimmed);
    const norm = looksLikeOneToken && !scheme ? normalizeUrlInput(trimmed) : { ok: false };
    if (norm.ok) {
      result.type = 'url';
      result.data = norm.url;
    } else {
      result.type = 'text';
      result.data = trimmed;
      if (scheme) {
        result.warnings.push('This text starts with "' + scheme + ':". It is encoded as plain text, ' +
          'but QR scanners may handle it unpredictably.');
      }
    }
  } else {
    result.error = 'Unknown content source.';
    return result;
  }

  result.chars = charCount(result.data);
  if (result.chars > MAX_CHARS) {
    result.error = 'Too long for a QR code: ' + result.chars.toLocaleString('en-US') +
      ' characters. The limit is ' + MAX_CHARS.toLocaleString('en-US') + '. Select a shorter piece of text.';
    return result;
  }
  const bytes = utf8Length(result.data);
  if (bytes > MAX_BYTES_M) {
    result.error = 'Too long for a QR code: this text needs ' + bytes.toLocaleString('en-US') +
      ' bytes once encoded, and a QR code holds at most ' + MAX_BYTES_M.toLocaleString('en-US') +
      '. Select a shorter piece of text.';
    return result;
  }
  if (result.chars > WARN_CHARS) {
    result.warnings.push('Long content makes a dense QR code that can be hard to scan. ' +
      'Under ' + WARN_CHARS + ' characters works best.');
  }
  result.ok = true;
  return result;
}

function pad2(n) { return String(n).padStart(2, '0'); }

/**
 * openqr-<host>-YYYYMMDD-HHMMSS.<ext> for web addresses,
 * openqr-text-YYYYMMDD-HHMMSS.<ext> for text. Local time.
 */
export function suggestFilename(type, data, ext, date = new Date()) {
  let label = 'text';
  if (type === 'url') {
    try {
      label = new URL(data).hostname.toLowerCase()
        .replace(/^www\./, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'link';
    } catch (e) {
      label = 'link';
    }
  }
  const stamp = date.getFullYear() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + '-' +
    pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
  return 'openqr-' + label + '-' + stamp + '.' + ext;
}
