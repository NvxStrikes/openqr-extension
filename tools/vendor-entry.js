// Entry point for the vendored bundle. Built by tools/build-vendor.mjs.
// Re-exports custom-qr-code and the qrcode-generator instance it uses, so
// the preview can pick the byte encoding (see preview.js, chooseEncoding).
export { CustomQRCode } from 'custom-qr-code';
export { default as qrcodegen } from 'qrcode-generator';
