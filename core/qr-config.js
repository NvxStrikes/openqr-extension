/**
 * QR options with the free default style of openqr.tech.
 * Mirrors buildCustomQrOptions() in OpenQR-Core js/generator.js with its
 * default control values: foreground #000000, background #ffffff, opaque,
 * error correction M, square dots and square corners, margin 10% (min 8).
 *
 * License: MIT (c) 2026 NovaStrikes
 */

export function buildCustomQrOptions(data, width, height, errLevel = 'M') {
  const fg = '#000000';
  const bg = '#ffffff';
  return {
    width: width,
    height: height,
    margin: Math.max(8, Math.round(width * 0.1)),
    data: data,
    dotsOptions: { color: fg, type: 'square' },
    backgroundOptions: { color: bg },
    cornersSquareOptions: { color: fg, type: 'square' },
    cornersDotOptions: { color: fg, type: 'square' },
    qrOptions: { errorCorrectionLevel: errLevel }
  };
}

// Download sizes. Same 1000 x 1000 SVG as the openqr.tech free download.
export const SVG_SIZE = 1000;
export const PNG_SIZE = 1000;
export const PREVIEW_SIZE = 240;
