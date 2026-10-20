/**
 * URL normalization for OpenQR.
 *
 * normalizeUrlInput() is copied verbatim (logic unchanged) from
 * OpenQR-Core js/generator.js, which in turn mirrors openqr-main/app.js.
 * Rules: only http/https; scheme-less input gets https://; protocol-relative
 * input (//host) gets https:; the hostname must contain a dot and must not
 * start or end with one. Any other scheme (javascript:, data:, vbscript:,
 * mailto:, file:, ...) is rejected.
 *
 * License: MIT (c) 2026 NovaStrikes
 */

export function normalizeUrlInput(raw) {
  if (raw === null || raw === undefined) return { ok: false, url: null, reason: null };
  const trimmed = String(raw).trim();
  if (!trimmed) return { ok: false, url: null, reason: null };

  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  let candidate = trimmed;

  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme === 'http' || scheme === 'https') {
      candidate = trimmed;
    } else {
      return {
        ok: false,
        url: null,
        reason: 'Only http(s) links are supported for URL QR codes'
      };
    }
  } else if (trimmed.startsWith('//')) {
    candidate = 'https:' + trimmed;
  } else {
    candidate = 'https://' + trimmed;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        ok: false,
        url: null,
        reason: 'Only http(s) links are supported for URL QR codes'
      };
    }
    const hostname = parsed.hostname;
    if (!hostname || !hostname.includes('.') || hostname.startsWith('.') || hostname.endsWith('.')) {
      return {
        ok: false,
        url: null,
        reason: 'Please enter a valid domain (e.g. example.com)'
      };
    }
    return { ok: true, url: candidate, reason: null };
  } catch(e) {
    return {
      ok: false,
      url: null,
      reason: 'Please enter a valid URL'
    };
  }
}
