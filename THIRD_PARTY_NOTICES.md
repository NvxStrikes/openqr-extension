# Third-Party Notices - OpenQR Extension

This extension vendors open-source software libraries into `vendor/custom-qr-code.js`.
All code runs locally on your device with no network calls and no remote scripts.

---

## 1. Vendored Bundle Summary

- **File**: `vendor/custom-qr-code.js`
- **SHA-256**: `fbddbcbced5312a6dbe854874a9ff9d7b58494e72b7e947a52181ab3c4c69727`
- **Build Method**: Built via `tools/build-vendor.mjs` using `esbuild` from pinned npm packages:
  - `custom-qr-code@2.0.3` (MIT)
  - `qrcode-generator@1.5.2` (MIT)
- **Modifications**: Bundled as a standalone, non-minified ESM module for browser MV3 execution without remote CDNs or external fetches.

---

## 2. custom-qr-code

- **Project**: custom-qr-code
- **Version**: 2.0.3
- **Repository**: https://github.com/AndrejNemec/custom-qr-code
- **Authors**: Andrej Nemec (2024), Denys Kozak (qr-code-styling, 2019)
- **License**: MIT License

```
MIT License

Copyright for portions of project custom-qr-code are held by [Denys Kozak, 2019] as part of project qr-code-styling. All other copyright for project custom-qr-code are held by [Andrej Nemec, 2024].

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 3. qrcode-generator

- **Project**: qrcode-generator
- **Version**: 1.5.2
- **Repository**: https://github.com/kazuhikoarase/qrcode-generator
- **Author**: Kazuhiko Arase (2009)
- **License**: MIT License

```
MIT License

Copyright (c) 2009 Kazuhiko Arase

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
