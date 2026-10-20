// Builds ../vendor/custom-qr-code.js from the pinned npm packages.
// One bundler step (esbuild), ESM output, no minification so reviewers can
// read it. Prints the SHA-256 to record in THIRD_PARTY_NOTICES.md.
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../vendor/custom-qr-code.js');

const pkg = (name) => JSON.parse(readFileSync(path.join(here, 'node_modules', name, 'package.json'), 'utf8')).version;

await build({
  entryPoints: [path.join(here, 'vendor-entry.js')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'chrome110',
  minify: false,
  legalComments: 'inline',
  sourcemap: false,
  outfile: out,
  banner: {
    js: `/*! Vendored for OpenQR extension. custom-qr-code@${pkg('custom-qr-code')} (MIT, Andrej Nemec; portions Denys Kozak) + qrcode-generator@${pkg('qrcode-generator')} (MIT, Kazuhiko Arase). Bundled with esbuild; see THIRD_PARTY_NOTICES.md. */`
  },
  logLevel: 'info'
});

const sha = createHash('sha256').update(readFileSync(out)).digest('hex');
console.log('custom-qr-code', pkg('custom-qr-code'), '| qrcode-generator', pkg('qrcode-generator'), '| esbuild', pkg('esbuild'));
console.log('SHA-256', sha, path.relative(path.resolve(here, '..'), out));
