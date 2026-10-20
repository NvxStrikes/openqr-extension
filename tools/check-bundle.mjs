// Static check: no remote code in the shipped extension files.
// Fails if any shipped .js/.html file contains an http(s) import, a remote
// script src, fetch/XMLHttpRequest/WebSocket/importScripts/eval usage.
// URL string literals are listed for manual review (some are expected,
// e.g. the SVG namespace and the openqr.tech Customize link).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['tools', 'tests', '.git', 'node_modules', 'dist']);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(js|mjs|html|json)$/.test(name)) acc.push(p);
  }
  return acc;
}

const forbidden = [
  [/\bimport\s*(?:[\w{}\s,*]+from\s*)?['"]https?:/g, 'remote static import'],
  [/\bimport\s*\(\s*['"`]https?:/g, 'remote dynamic import'],
  [/<script[^>]+src\s*=\s*['"]https?:/gi, 'remote <script src>'],
  [/\bfetch\s*\(/g, 'fetch('],
  [/\bXMLHttpRequest\b/g, 'XMLHttpRequest'],
  [/\bWebSocket\b/g, 'WebSocket'],
  [/\bimportScripts\s*\(/g, 'importScripts('],
  [/\beval\s*\(/g, 'eval('],
  [/\bnew\s+Function\s*\(/g, 'new Function('],
  [/\bsendBeacon\b/g, 'sendBeacon']
];

// Known, reviewed exceptions. Each is matched by file + exact source line.
// custom-qr-code's QRSVG._getImageBlob fetches options.image (a logo) to
// inline it. The extension never sets options.image, and the manifest CSP
// sets connect-src 'none' and img-src 'self' blob: data:, so it cannot reach
// the network even if called.
const ALLOW = [
  { file: 'vendor/custom-qr-code.js', line: 'return (await fetch(i)).blob();', why: 'dormant logo inlining path (options.image never set; CSP connect-src none)' }
];

let failures = 0;
const allowed = [];
const urlReport = new Map();
for (const file of walk(root)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const src = readFileSync(file, 'utf8');
  for (const [re, label] of forbidden) {
    for (const m of src.matchAll(re)) {
      const line = src.slice(0, m.index).split('\n').length;
      const text = src.split('\n')[line - 1].trim();
      const ok = ALLOW.find(a => a.file === rel && a.line === text);
      if (ok) { allowed.push(`ALLOWED ${rel}:${line} ${label} - ${ok.why}`); continue; }
      console.log(`FAIL ${rel}:${line} ${label}`);
      failures++;
    }
  }
  for (const m of src.matchAll(/https?:\/\/[^\s'"`)<>]+/g)) {
    const key = m[0];
    if (!urlReport.has(key)) urlReport.set(key, new Set());
    urlReport.get(key).add(rel);
  }
}

for (const a of allowed) console.log(a);
// The extension's own code must never pass a logo image to the library.
for (const f of ['preview.js', 'core/qr-config.js']) {
  const src = readFileSync(path.join(root, f), 'utf8');
  if (/\bimage\s*:/.test(src)) { console.log(`FAIL ${f} sets an image option`); failures++; }
}
console.log('\nURL literals found in shipped files (review):');
for (const [u, files] of [...urlReport].sort()) console.log(`  ${u}  <- ${[...files].join(', ')}`);
console.log(failures ? `\n${failures} forbidden pattern(s) found` : '\nOK: no remote imports, remote scripts or network APIs in shipped files');
process.exit(failures ? 1 : 0);
