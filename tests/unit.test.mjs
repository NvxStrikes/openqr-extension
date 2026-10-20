// Unit tests for the pure rules. Run: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrlInput } from '../core/normalize.js';
import { classifyContent, suggestFilename, riskyScheme, MAX_CHARS } from '../core/content.js';
import { buildCustomizeUrl, parseHandoffFragment, MAX_PAYLOAD_CHARS } from '../core/handoff.js';

test('normalizeUrlInput matches OpenQR-Core rules', () => {
  assert.deepEqual(normalizeUrlInput('example.com'), { ok: true, url: 'https://example.com', reason: null });
  assert.deepEqual(normalizeUrlInput('//example.com/x'), { ok: true, url: 'https://example.com/x', reason: null });
  assert.equal(normalizeUrlInput('http://a.b/c?d#e').url, 'http://a.b/c?d#e');
  assert.equal(normalizeUrlInput('javascript:alert(1)').ok, false);
  assert.equal(normalizeUrlInput('data:text/html,hi').ok, false);
  assert.equal(normalizeUrlInput('ftp://example.com').ok, false);
  assert.equal(normalizeUrlInput('localhost').ok, false);
  assert.equal(normalizeUrlInput('   ').reason, null);
});

test('page and link sources accept only http(s)', () => {
  assert.equal(classifyContent('page', 'https://example.com/a').type, 'url');
  const bad = classifyContent('link', 'javascript:alert(1)');
  assert.equal(bad.ok, false);
  assert.match(bad.error, /Only http\(s\)/);
  assert.equal(classifyContent('link', 'mailto:a@b.c').ok, false);
});

test('selection: URL vs text, risky schemes, whitespace', () => {
  assert.deepEqual([classifyContent('selection', 'example.com').type, classifyContent('selection', 'example.com').data], ['url', 'https://example.com']);
  assert.equal(classifyContent('selection', 'hello world').type, 'text');
  assert.equal(classifyContent('selection', 'https://a.com\nmore').type, 'text');
  const js = classifyContent('selection', '  JavaScript:alert(1)');
  assert.equal(js.ok, true);
  assert.equal(js.type, 'text');
  assert.equal(js.warnings.length, 1);
  assert.match(js.warnings[0], /scanners may handle it unpredictably/);
  assert.equal(riskyScheme('java\nscript:x'), 'javascript');
  assert.equal(riskyScheme('vbscript:x'), 'vbscript');
  assert.equal(riskyScheme('data:x'), 'data');
  assert.equal(riskyScheme('mailto:x'), null);
});

test('empty selection is refused with a message', () => {
  const r = classifyContent('selection', '   ');
  assert.equal(r.ok, false);
  assert.match(r.error, /No text was selected/);
});

test('length limits', () => {
  const ok = classifyContent('selection', 'a '.repeat(250) + 'b');  // 501 chars
  assert.equal(ok.ok, true);
  assert.match(ok.warnings.join(' '), /hard to scan/);
  assert.equal(classifyContent('selection', 'x'.repeat(500)).warnings.length, 0);
  assert.equal(classifyContent('selection', 'x'.repeat(MAX_CHARS)).ok, true);
  const tooLong = classifyContent('selection', 'x'.repeat(MAX_CHARS + 1));
  assert.equal(tooLong.ok, false);
  assert.match(tooLong.error, /2,001 characters\. The limit is 2,000/);
  // 1,000 CJK characters = 3,000 UTF-8 bytes: over byte capacity.
  const cjk = classifyContent('selection', '\u4e2d'.repeat(1000));
  assert.equal(cjk.ok, false);
  assert.match(cjk.error, /bytes/);
});

test('filenames', () => {
  const d = new Date(2026, 9, 20, 14, 5, 9);
  assert.equal(suggestFilename('url', 'https://www.Example.co.uk/x', 'svg', d), 'openqr-example-co-uk-20261020-140509.svg');
  assert.equal(suggestFilename('text', 'anything', 'png', d), 'openqr-text-20261020-140509.png');
});

test('handoff round trip, version prefix, rejection', () => {
  for (const [type, data] of [['url', 'https://example.com/?q=1&r=<x>'], ['text', 'سلام دنیا \u{1F600} "quotes" \n line']]) {
    const r = buildCustomizeUrl(type, data);
    assert.equal(r.ok, true);
    assert.ok(r.url.startsWith('https://openqr.tech/#oqr=1.'));
    assert.ok(!r.url.includes('?'));
    assert.match(r.url.split('#oqr=1.')[1], /^[A-Za-z0-9_-]+$/);
    assert.deepEqual(parseHandoffFragment('#' + r.url.split('#')[1]), { type, data });
  }
  // Control characters are JSON-escaped to 6 bytes each: rejected, not truncated.
  const r = buildCustomizeUrl('text', '\u0001'.repeat(1500));
  assert.equal(r.ok, false);
  assert.equal(buildCustomizeUrl('html', 'x').ok, false);
  assert.equal(MAX_PAYLOAD_CHARS, 8000);
});

test('handoff parser rejects malformed input', () => {
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  for (const h of [
    '', '#oqr=', '#oqr=2.' + enc({ type: 'url', data: 'x' }), '#oqr=1.!!!', '#oqr=1.' + enc([1]),
    '#oqr=1.' + enc({ type: 'script', data: 'x' }), '#oqr=1.' + enc({ type: 'url', data: '' }),
    '#oqr=1.' + enc({ type: 'url', data: 'x', style: {} }), '#oqr=1.' + enc({ type: 'text', data: 'x'.repeat(2001) }),
    '#oqr=1.' + Buffer.from([0xff, 0xfe]).toString('base64url')
  ]) {
    assert.equal(parseHandoffFragment(h), null, h);
  }
});
