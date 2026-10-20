/**
 * Customize handoff to openqr.tech.
 *
 * Format (version 1):
 *   https://openqr.tech/#oqr=1.<payload>
 *   payload = base64url( UTF-8( JSON.stringify({ type, data }) ) ), no padding
 *   type    = "url" | "text"
 *   data    = the exact string the extension encoded (1..2000 characters)
 *
 * The content travels only in the URL fragment, which browsers never send
 * to the server. Over-limit payloads are rejected, never truncated.
 *
 * License: MIT (c) 2026 NovaStrikes
 */

import { MAX_CHARS, charCount } from './content.js';

export const HANDOFF_ORIGIN = 'https://openqr.tech/';
export const HANDOFF_KEY = 'oqr';
export const HANDOFF_VERSION = '1';
// Cap on the base64url payload length (characters after "1.").
// 8,000 base64url characters = 6,000 bytes of JSON: room for 2,000
// characters of 3-byte UTF-8 text. Text full of characters that JSON must
// escape (control characters) can exceed it and is rejected.
export const MAX_PAYLOAD_CHARS = 8000;

export function base64UrlEncodeUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlDecodeUtf8(b64) {
  if (!/^[A-Za-z0-9_-]*$/.test(b64)) throw new Error('bad alphabet');
  const std = b64.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(std + '='.repeat((4 - std.length % 4) % 4));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

/**
 * @returns {{ ok: true, url: string } | { ok: false, error: string }}
 */
export function buildCustomizeUrl(type, data) {
  if (type !== 'url' && type !== 'text') return { ok: false, error: 'Unsupported content type.' };
  if (typeof data !== 'string' || !data) return { ok: false, error: 'Nothing to send.' };
  if (charCount(data) > MAX_CHARS) return { ok: false, error: 'Too long to open in the editor.' };
  const payload = base64UrlEncodeUtf8(JSON.stringify({ type, data }));
  if (payload.length > MAX_PAYLOAD_CHARS) {
    return { ok: false, error: 'This content is too large to open in the editor once encoded.' };
  }
  return { ok: true, url: HANDOFF_ORIGIN + '#' + HANDOFF_KEY + '=' + HANDOFF_VERSION + '.' + payload };
}

/**
 * Reference decoder, same rules the website handler must apply.
 * Returns { type, data } or null for anything malformed.
 */
export function parseHandoffFragment(hash) {
  try {
    const prefix = '#' + HANDOFF_KEY + '=' + HANDOFF_VERSION + '.';
    if (typeof hash !== 'string' || !hash.startsWith(prefix)) return null;
    const payload = hash.slice(prefix.length);
    if (!payload || payload.length > MAX_PAYLOAD_CHARS) return null;
    const obj = JSON.parse(base64UrlDecodeUtf8(payload));
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    const keys = Object.keys(obj).sort().join(',');
    if (keys !== 'data,type') return null;
    if (obj.type !== 'url' && obj.type !== 'text') return null;
    if (typeof obj.data !== 'string' || !obj.data || charCount(obj.data) > MAX_CHARS) return null;
    return { type: obj.type, data: obj.data };
  } catch (e) {
    return null;
  }
}
