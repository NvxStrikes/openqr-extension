/**
 * OpenQR background service worker.
 *
 * Registers three context menu items and opens the preview in a small popup
 * window. The content to encode is handed over through chrome.storage.session
 * under a random one-time key; only that key goes in the preview URL, never
 * the page address, link or selected text.
 *
 * No network access, no host permissions, no content scripts.
 * License: MIT (c) 2026 NovaStrikes
 */

const MENU = {
  page: 'openqr-page',
  link: 'openqr-link',
  selection: 'openqr-selection'
};

const PREVIEW_WIDTH = 380;
const PREVIEW_HEIGHT = 640;
const KEY_PREFIX = 'handoff:';

function createMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU.page,
      title: 'Create QR code for this page',
      contexts: ['page'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });
    chrome.contextMenus.create({
      id: MENU.link,
      title: 'Create QR code for this link',
      contexts: ['link'],
      targetUrlPatterns: ['http://*/*', 'https://*/*']
    });
    chrome.contextMenus.create({
      id: MENU.selection,
      title: 'Create QR code for selected text',
      contexts: ['selection']
    });
  });
}

chrome.runtime.onInstalled.addListener(createMenus);

/**
 * Turns a context menu click into a preview window.
 * A classic (non-module) worker, so this is reachable from the service
 * worker console for testing.
 */
async function handleMenuClick(info) {
  let source;
  let raw;
  if (info.menuItemId === MENU.page) {
    source = 'page';
    raw = info.pageUrl;
  } else if (info.menuItemId === MENU.link) {
    source = 'link';
    raw = info.linkUrl;
  } else if (info.menuItemId === MENU.selection) {
    source = 'selection';
    raw = info.selectionText;
  } else {
    return;
  }
  await openPreview(source, typeof raw === 'string' ? raw : '');
}

async function openPreview(source, raw) {
  const id = crypto.randomUUID();
  const key = KEY_PREFIX + id;
  await chrome.storage.session.set({ [key]: { source, raw, createdAt: Date.now() } });
  try {
    await chrome.windows.create({
      url: chrome.runtime.getURL('preview.html?k=' + id),
      type: 'popup',
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
      focused: true
    });
  } catch (err) {
    await chrome.storage.session.remove(key);
    throw err;
  }
}

chrome.contextMenus.onClicked.addListener((info) => {
  handleMenuClick(info).catch((err) => console.error('OpenQR: could not open preview', err));
});
