# Chrome Web Store Listing - OpenQR

---

## 1. Store Metadata

### Title / Name
`OpenQR - Instant QR Code Generator`  
*(36 / 45 characters)*

### Short Description / Summary
`Right-click a page, link or selected text to preview a QR code. Download as SVG or PNG, or copy the image. Generated on your device.`  
*(132 / 132 characters - excludes "open source" per policy until the repository is public)*

### Category
Productivity

---

## 2. Detailed Description

```markdown
Generate clean, scannable QR codes instantly for any web page, link, or highlighted text directly from your right-click menu.

OpenQR is built for speed, privacy, and precision:
• 100% on-device generation — your links and text are never sent to external servers or logged.
• Crisp vector SVG download (scalable to any print size) and high-resolution PNG (1000x1000).
• One-click "Copy image" to paste directly into documents, emails, or design tools.
• Zero bloat, zero background trackers, zero remote code.

---

### Features

1. Right-Click Context Menu
   • Right-click any webpage to generate a QR code for the current URL.
   • Right-click any link to generate a QR code for the target destination.
   • Highlight any text to generate a QR code for the selected content.

2. Export Formats
   • SVG (Default): Pure vector format with viewBox, ideal for print, packaging, stickers, and Figma.
   • PNG: 1000x1000 pixel raster format for instant web and chat sharing.

3. Instant Clipboard Copy
   • Copy the rasterized QR code directly to your clipboard in one click without saving temporary files.

4. Customize Handoff
   • Want custom brand colors, logos, or sticker frames? Click "Customize on openqr.tech".
   • The extension hands off your payload securely using a client-side URL fragment (#oqr=1....), which browsers never transmit over HTTP requests.
   • Before opening the editor, an explicit privacy notice informs you that web addresses are checked for safety by Google Safe Browsing as described in our privacy policy.

5. Accessibility & Dark Mode
   • Full keyboard navigation (Tab navigation, Escape to close).
   • Automatic light and dark mode matching your operating system theme.
   • High-contrast QR card ensures camera scannability under all display themes.

---

### Privacy & Permissions

OpenQR requires only two minimal permissions:
• contextMenus: Displays the "Create QR code" options in the right-click menu.
• storage: Temporarily stores the selected payload in memory (`chrome.storage.session`) while passing it to the preview popup window, then immediately deletes it.

OpenQR does NOT require:
• No <all_urls> or broad website access.
• No activeTab or page-reading content scripts.
• No clipboardRead permission.
• No network requests or analytics.
```

---

## 3. Chrome Web Store Justifications & Disclosures

### Single Purpose Description
> "OpenQR generates instant, downloadable QR codes on-device for the current page, links, or highlighted text directly from the right-click context menu."

### Permission Justifications
- **`contextMenus`**:  
  *"Required to display context menu items when the user right-clicks on a page, hyperlink, or text selection."*
- **`storage`**:  
  *"Required to use `chrome.storage.session` for transient, in-memory payload handoff between the background service worker and the preview popup window. Data is deleted immediately upon display."*

### Data Disclosure Declarations
- **Does the extension collect user data?** `No`.
- **Does the extension transmit data to external servers?** `No`. All QR code rendering occurs locally in the user's browser.
- **Does the extension use remote code (CDNs/eval)?** `No`. The QR generation library (`custom-qr-code`) is fully bundled locally.
- **Does the extension sell user data?** `No`.
- **Does the extension use data for creditworthiness or lending?** `No`.

---

## 4. Privacy Policy Outline (`https://openqr.tech/privacy.html`)

1. **Local Processing Guarantee**: All QR rendering, normalization, and image exports occur entirely on the client device.
2. **Zero Extension Data Transmission**: The extension makes zero network calls, contains no tracking pixels, and sends no telemetry.
3. **Customize Handoff Transparency**: Clicking "Customize on openqr.tech" opens the website using a client-side URL fragment. Web addresses entered into the web editor are checked for malicious activity via Google Safe Browsing and our verification endpoint.
4. **Permissions Audit**: Technical breakdown of `contextMenus` and `storage`.
5. **Open Source & Verification**: Instructions for developers to inspect the source code and verify build integrity.
