# OpenQR Browser Extension

Manifest V3 extension for Chrome and Microsoft Edge that creates QR codes on-device directly from the right-click context menu.

## What it does

- **Right-click context menu** (`contextMenus`):
  - **Create QR code for this page** (`http://*/*`, `https://*/*`)
  - **Create QR code for this link** (`http://*/*`, `https://*/*`)
  - **Create QR code for selected text** (normalizes URLs automatically when appropriate, otherwise encodes as plain text)
- **Local preview & export**: Renders an on-device QR preview in a popup window using the bundled `vendor/custom-qr-code.js` library, with **SVG** and **PNG** (1000x1000) downloads and one-click **Copy image** to the clipboard.
- **Customize handoff (optional)**: Clicking **Customize on openqr.tech** and confirming in the prompt opens `https://openqr.tech/#oqr=1.<payload>` so you can add colors, logos, and sticker frames in the web editor.

## How to load unpacked

1. Open `chrome://extensions` in Chrome (or `edge://extensions` in Microsoft Edge).
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this repository's root folder (`openqr-extension`).
4. Right-click any webpage, link, or highlighted text and choose one of the **Create QR code...** menu items.

## Privacy

- All QR generation, preview rendering, SVG/PNG downloads, and clipboard copies run **locally on your device** with no network requests or background telemetry (`manifest.json` enforces `connect-src 'none'`, requests only `contextMenus` and `storage` permissions, and uses `chrome.storage.session` solely for a one-time in-memory handoff deleted immediately on load).
- Nothing leaves your device unless you explicitly click **Customize on openqr.tech** and confirm **Continue to openqr.tech** in the dialog. The content is passed in the client-side URL fragment (`#oqr=1....`), after which web addresses opened in the `openqr.tech` editor are checked for safety by OpenQR's server and Google Safe Browsing (per `preview.html` and the OpenQR Privacy Policy).

## Development & checks

```bash
node --test tests/unit.test.mjs
node tools/check-bundle.mjs
```
