/*! Vendored for OpenQR extension. custom-qr-code@2.0.3 (MIT, Andrej Nemec; portions Denys Kozak) + qrcode-generator@1.5.2 (MIT, Kazuhiko Arase). Bundled with esbuild; see THIRD_PARTY_NOTICES.md. */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/qrcode-generator/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode-generator/qrcode.js"(exports, module) {
    var qrcode = (function() {
      var qrcode2 = function(typeNumber, errorCorrectionLevel) {
        var PAD0 = 236;
        var PAD1 = 17;
        var _typeNumber = typeNumber;
        var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
        var _modules = null;
        var _moduleCount = 0;
        var _dataCache = null;
        var _dataList = [];
        var _this = {};
        var makeImpl = function(test, maskPattern) {
          _moduleCount = _typeNumber * 4 + 17;
          _modules = (function(moduleCount) {
            var modules = new Array(moduleCount);
            for (var row = 0; row < moduleCount; row += 1) {
              modules[row] = new Array(moduleCount);
              for (var col = 0; col < moduleCount; col += 1) {
                modules[row][col] = null;
              }
            }
            return modules;
          })(_moduleCount);
          setupPositionProbePattern(0, 0);
          setupPositionProbePattern(_moduleCount - 7, 0);
          setupPositionProbePattern(0, _moduleCount - 7);
          setupPositionAdjustPattern();
          setupTimingPattern();
          setupTypeInfo(test, maskPattern);
          if (_typeNumber >= 7) {
            setupTypeNumber(test);
          }
          if (_dataCache == null) {
            _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
          }
          mapData(_dataCache, maskPattern);
        };
        var setupPositionProbePattern = function(row, col) {
          for (var r3 = -1; r3 <= 7; r3 += 1) {
            if (row + r3 <= -1 || _moduleCount <= row + r3) continue;
            for (var c3 = -1; c3 <= 7; c3 += 1) {
              if (col + c3 <= -1 || _moduleCount <= col + c3) continue;
              if (0 <= r3 && r3 <= 6 && (c3 == 0 || c3 == 6) || 0 <= c3 && c3 <= 6 && (r3 == 0 || r3 == 6) || 2 <= r3 && r3 <= 4 && 2 <= c3 && c3 <= 4) {
                _modules[row + r3][col + c3] = true;
              } else {
                _modules[row + r3][col + c3] = false;
              }
            }
          }
        };
        var getBestMaskPattern = function() {
          var minLostPoint = 0;
          var pattern = 0;
          for (var i = 0; i < 8; i += 1) {
            makeImpl(true, i);
            var lostPoint = QRUtil.getLostPoint(_this);
            if (i == 0 || minLostPoint > lostPoint) {
              minLostPoint = lostPoint;
              pattern = i;
            }
          }
          return pattern;
        };
        var setupTimingPattern = function() {
          for (var r3 = 8; r3 < _moduleCount - 8; r3 += 1) {
            if (_modules[r3][6] != null) {
              continue;
            }
            _modules[r3][6] = r3 % 2 == 0;
          }
          for (var c3 = 8; c3 < _moduleCount - 8; c3 += 1) {
            if (_modules[6][c3] != null) {
              continue;
            }
            _modules[6][c3] = c3 % 2 == 0;
          }
        };
        var setupPositionAdjustPattern = function() {
          var pos = QRUtil.getPatternPosition(_typeNumber);
          for (var i = 0; i < pos.length; i += 1) {
            for (var j = 0; j < pos.length; j += 1) {
              var row = pos[i];
              var col = pos[j];
              if (_modules[row][col] != null) {
                continue;
              }
              for (var r3 = -2; r3 <= 2; r3 += 1) {
                for (var c3 = -2; c3 <= 2; c3 += 1) {
                  if (r3 == -2 || r3 == 2 || c3 == -2 || c3 == 2 || r3 == 0 && c3 == 0) {
                    _modules[row + r3][col + c3] = true;
                  } else {
                    _modules[row + r3][col + c3] = false;
                  }
                }
              }
            }
          }
        };
        var setupTypeNumber = function(test) {
          var bits = QRUtil.getBCHTypeNumber(_typeNumber);
          for (var i = 0; i < 18; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
          }
          for (var i = 0; i < 18; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
          }
        };
        var setupTypeInfo = function(test, maskPattern) {
          var data = _errorCorrectionLevel << 3 | maskPattern;
          var bits = QRUtil.getBCHTypeInfo(data);
          for (var i = 0; i < 15; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            if (i < 6) {
              _modules[i][8] = mod;
            } else if (i < 8) {
              _modules[i + 1][8] = mod;
            } else {
              _modules[_moduleCount - 15 + i][8] = mod;
            }
          }
          for (var i = 0; i < 15; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            if (i < 8) {
              _modules[8][_moduleCount - i - 1] = mod;
            } else if (i < 9) {
              _modules[8][15 - i - 1 + 1] = mod;
            } else {
              _modules[8][15 - i - 1] = mod;
            }
          }
          _modules[_moduleCount - 8][8] = !test;
        };
        var mapData = function(data, maskPattern) {
          var inc = -1;
          var row = _moduleCount - 1;
          var bitIndex = 7;
          var byteIndex = 0;
          var maskFunc = QRUtil.getMaskFunction(maskPattern);
          for (var col = _moduleCount - 1; col > 0; col -= 2) {
            if (col == 6) col -= 1;
            while (true) {
              for (var c3 = 0; c3 < 2; c3 += 1) {
                if (_modules[row][col - c3] == null) {
                  var dark = false;
                  if (byteIndex < data.length) {
                    dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                  }
                  var mask = maskFunc(row, col - c3);
                  if (mask) {
                    dark = !dark;
                  }
                  _modules[row][col - c3] = dark;
                  bitIndex -= 1;
                  if (bitIndex == -1) {
                    byteIndex += 1;
                    bitIndex = 7;
                  }
                }
              }
              row += inc;
              if (row < 0 || _moduleCount <= row) {
                row -= inc;
                inc = -inc;
                break;
              }
            }
          }
        };
        var createBytes = function(buffer, rsBlocks) {
          var offset = 0;
          var maxDcCount = 0;
          var maxEcCount = 0;
          var dcdata = new Array(rsBlocks.length);
          var ecdata = new Array(rsBlocks.length);
          for (var r3 = 0; r3 < rsBlocks.length; r3 += 1) {
            var dcCount = rsBlocks[r3].dataCount;
            var ecCount = rsBlocks[r3].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount);
            maxEcCount = Math.max(maxEcCount, ecCount);
            dcdata[r3] = new Array(dcCount);
            for (var i = 0; i < dcdata[r3].length; i += 1) {
              dcdata[r3][i] = 255 & buffer.getBuffer()[i + offset];
            }
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
            var rawPoly = qrPolynomial(dcdata[r3], rsPoly.getLength() - 1);
            var modPoly = rawPoly.mod(rsPoly);
            ecdata[r3] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r3].length; i += 1) {
              var modIndex = i + modPoly.getLength() - ecdata[r3].length;
              ecdata[r3][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
            }
          }
          var totalCodeCount = 0;
          for (var i = 0; i < rsBlocks.length; i += 1) {
            totalCodeCount += rsBlocks[i].totalCount;
          }
          var data = new Array(totalCodeCount);
          var index = 0;
          for (var i = 0; i < maxDcCount; i += 1) {
            for (var r3 = 0; r3 < rsBlocks.length; r3 += 1) {
              if (i < dcdata[r3].length) {
                data[index] = dcdata[r3][i];
                index += 1;
              }
            }
          }
          for (var i = 0; i < maxEcCount; i += 1) {
            for (var r3 = 0; r3 < rsBlocks.length; r3 += 1) {
              if (i < ecdata[r3].length) {
                data[index] = ecdata[r3][i];
                index += 1;
              }
            }
          }
          return data;
        };
        var createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
          var buffer = qrBitBuffer();
          for (var i = 0; i < dataList.length; i += 1) {
            var data = dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
            data.write(buffer);
          }
          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i += 1) {
            totalDataCount += rsBlocks[i].dataCount;
          }
          if (buffer.getLengthInBits() > totalDataCount * 8) {
            throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
          }
          if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
            buffer.put(0, 4);
          }
          while (buffer.getLengthInBits() % 8 != 0) {
            buffer.putBit(false);
          }
          while (true) {
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
              break;
            }
            buffer.put(PAD0, 8);
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
              break;
            }
            buffer.put(PAD1, 8);
          }
          return createBytes(buffer, rsBlocks);
        };
        _this.addData = function(data, mode) {
          mode = mode || "Byte";
          var newData = null;
          switch (mode) {
            case "Numeric":
              newData = qrNumber(data);
              break;
            case "Alphanumeric":
              newData = qrAlphaNum(data);
              break;
            case "Byte":
              newData = qr8BitByte(data);
              break;
            case "Kanji":
              newData = qrKanji(data);
              break;
            default:
              throw "mode:" + mode;
          }
          _dataList.push(newData);
          _dataCache = null;
        };
        _this.isDark = function(row, col) {
          if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
            throw row + "," + col;
          }
          return _modules[row][col];
        };
        _this.getModuleCount = function() {
          return _moduleCount;
        };
        _this.make = function() {
          if (_typeNumber < 1) {
            var typeNumber2 = 1;
            for (; typeNumber2 < 40; typeNumber2++) {
              var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
              var buffer = qrBitBuffer();
              for (var i = 0; i < _dataList.length; i++) {
                var data = _dataList[i];
                buffer.put(data.getMode(), 4);
                buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
                data.write(buffer);
              }
              var totalDataCount = 0;
              for (var i = 0; i < rsBlocks.length; i++) {
                totalDataCount += rsBlocks[i].dataCount;
              }
              if (buffer.getLengthInBits() <= totalDataCount * 8) {
                break;
              }
            }
            _typeNumber = typeNumber2;
          }
          makeImpl(false, getBestMaskPattern());
        };
        _this.createTableTag = function(cellSize, margin) {
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          var qrHtml = "";
          qrHtml += '<table style="';
          qrHtml += " border-width: 0px; border-style: none;";
          qrHtml += " border-collapse: collapse;";
          qrHtml += " padding: 0px; margin: " + margin + "px;";
          qrHtml += '">';
          qrHtml += "<tbody>";
          for (var r3 = 0; r3 < _this.getModuleCount(); r3 += 1) {
            qrHtml += "<tr>";
            for (var c3 = 0; c3 < _this.getModuleCount(); c3 += 1) {
              qrHtml += '<td style="';
              qrHtml += " border-width: 0px; border-style: none;";
              qrHtml += " border-collapse: collapse;";
              qrHtml += " padding: 0px; margin: 0px;";
              qrHtml += " width: " + cellSize + "px;";
              qrHtml += " height: " + cellSize + "px;";
              qrHtml += " background-color: ";
              qrHtml += _this.isDark(r3, c3) ? "#000000" : "#ffffff";
              qrHtml += ";";
              qrHtml += '"/>';
            }
            qrHtml += "</tr>";
          }
          qrHtml += "</tbody>";
          qrHtml += "</table>";
          return qrHtml;
        };
        _this.createSvgTag = function(cellSize, margin, alt, title) {
          var opts = {};
          if (typeof arguments[0] == "object") {
            opts = arguments[0];
            cellSize = opts.cellSize;
            margin = opts.margin;
            alt = opts.alt;
            title = opts.title;
          }
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          alt = typeof alt === "string" ? { text: alt } : alt || {};
          alt.text = alt.text || null;
          alt.id = alt.text ? alt.id || "qrcode-description" : null;
          title = typeof title === "string" ? { text: title } : title || {};
          title.text = title.text || null;
          title.id = title.text ? title.id || "qrcode-title" : null;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var c3, mc, r3, mr, qrSvg = "", rect;
          rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
          qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
          qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
          qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
          qrSvg += ' preserveAspectRatio="xMinYMin meet"';
          qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
          qrSvg += ">";
          qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
          qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
          qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
          qrSvg += '<path d="';
          for (r3 = 0; r3 < _this.getModuleCount(); r3 += 1) {
            mr = r3 * cellSize + margin;
            for (c3 = 0; c3 < _this.getModuleCount(); c3 += 1) {
              if (_this.isDark(r3, c3)) {
                mc = c3 * cellSize + margin;
                qrSvg += "M" + mc + "," + mr + rect;
              }
            }
          }
          qrSvg += '" stroke="transparent" fill="black"/>';
          qrSvg += "</svg>";
          return qrSvg;
        };
        _this.createDataURL = function(cellSize, margin) {
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var min = margin;
          var max = size - margin;
          return createDataURL(size, size, function(x, y2) {
            if (min <= x && x < max && min <= y2 && y2 < max) {
              var c3 = Math.floor((x - min) / cellSize);
              var r3 = Math.floor((y2 - min) / cellSize);
              return _this.isDark(r3, c3) ? 0 : 1;
            } else {
              return 1;
            }
          });
        };
        _this.createImgTag = function(cellSize, margin, alt) {
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var img = "";
          img += "<img";
          img += ' src="';
          img += _this.createDataURL(cellSize, margin);
          img += '"';
          img += ' width="';
          img += size;
          img += '"';
          img += ' height="';
          img += size;
          img += '"';
          if (alt) {
            img += ' alt="';
            img += escapeXml(alt);
            img += '"';
          }
          img += "/>";
          return img;
        };
        var escapeXml = function(s2) {
          var escaped = "";
          for (var i = 0; i < s2.length; i += 1) {
            var c3 = s2.charAt(i);
            switch (c3) {
              case "<":
                escaped += "&lt;";
                break;
              case ">":
                escaped += "&gt;";
                break;
              case "&":
                escaped += "&amp;";
                break;
              case '"':
                escaped += "&quot;";
                break;
              default:
                escaped += c3;
                break;
            }
          }
          return escaped;
        };
        var _createHalfASCII = function(margin) {
          var cellSize = 1;
          margin = typeof margin == "undefined" ? cellSize * 2 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var min = margin;
          var max = size - margin;
          var y2, x, r1, r22, p2;
          var blocks = {
            "\u2588\u2588": "\u2588",
            "\u2588 ": "\u2580",
            " \u2588": "\u2584",
            "  ": " "
          };
          var blocksLastLineNoMargin = {
            "\u2588\u2588": "\u2580",
            "\u2588 ": "\u2580",
            " \u2588": " ",
            "  ": " "
          };
          var ascii = "";
          for (y2 = 0; y2 < size; y2 += 2) {
            r1 = Math.floor((y2 - min) / cellSize);
            r22 = Math.floor((y2 + 1 - min) / cellSize);
            for (x = 0; x < size; x += 1) {
              p2 = "\u2588";
              if (min <= x && x < max && min <= y2 && y2 < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
                p2 = " ";
              }
              if (min <= x && x < max && min <= y2 + 1 && y2 + 1 < max && _this.isDark(r22, Math.floor((x - min) / cellSize))) {
                p2 += " ";
              } else {
                p2 += "\u2588";
              }
              ascii += margin < 1 && y2 + 1 >= max ? blocksLastLineNoMargin[p2] : blocks[p2];
            }
            ascii += "\n";
          }
          if (size % 2 && margin > 0) {
            return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("\u2580");
          }
          return ascii.substring(0, ascii.length - 1);
        };
        _this.createASCII = function(cellSize, margin) {
          cellSize = cellSize || 1;
          if (cellSize < 2) {
            return _createHalfASCII(margin);
          }
          cellSize -= 1;
          margin = typeof margin == "undefined" ? cellSize * 2 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var min = margin;
          var max = size - margin;
          var y2, x, r3, p2;
          var white = Array(cellSize + 1).join("\u2588\u2588");
          var black = Array(cellSize + 1).join("  ");
          var ascii = "";
          var line = "";
          for (y2 = 0; y2 < size; y2 += 1) {
            r3 = Math.floor((y2 - min) / cellSize);
            line = "";
            for (x = 0; x < size; x += 1) {
              p2 = 1;
              if (min <= x && x < max && min <= y2 && y2 < max && _this.isDark(r3, Math.floor((x - min) / cellSize))) {
                p2 = 0;
              }
              line += p2 ? white : black;
            }
            for (r3 = 0; r3 < cellSize; r3 += 1) {
              ascii += line + "\n";
            }
          }
          return ascii.substring(0, ascii.length - 1);
        };
        _this.renderTo2dContext = function(context, cellSize) {
          cellSize = cellSize || 2;
          var length = _this.getModuleCount();
          for (var row = 0; row < length; row++) {
            for (var col = 0; col < length; col++) {
              context.fillStyle = _this.isDark(row, col) ? "black" : "white";
              context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
            }
          }
        };
        return _this;
      };
      qrcode2.stringToBytesFuncs = {
        "default": function(s2) {
          var bytes = [];
          for (var i = 0; i < s2.length; i += 1) {
            var c3 = s2.charCodeAt(i);
            bytes.push(c3 & 255);
          }
          return bytes;
        }
      };
      qrcode2.stringToBytes = qrcode2.stringToBytesFuncs["default"];
      qrcode2.createStringToBytes = function(unicodeData, numChars) {
        var unicodeMap = (function() {
          var bin = base64DecodeInputStream(unicodeData);
          var read = function() {
            var b4 = bin.read();
            if (b4 == -1) throw "eof";
            return b4;
          };
          var count = 0;
          var unicodeMap2 = {};
          while (true) {
            var b0 = bin.read();
            if (b0 == -1) break;
            var b1 = read();
            var b22 = read();
            var b3 = read();
            var k = String.fromCharCode(b0 << 8 | b1);
            var v = b22 << 8 | b3;
            unicodeMap2[k] = v;
            count += 1;
          }
          if (count != numChars) {
            throw count + " != " + numChars;
          }
          return unicodeMap2;
        })();
        var unknownChar = "?".charCodeAt(0);
        return function(s2) {
          var bytes = [];
          for (var i = 0; i < s2.length; i += 1) {
            var c3 = s2.charCodeAt(i);
            if (c3 < 128) {
              bytes.push(c3);
            } else {
              var b3 = unicodeMap[s2.charAt(i)];
              if (typeof b3 == "number") {
                if ((b3 & 255) == b3) {
                  bytes.push(b3);
                } else {
                  bytes.push(b3 >>> 8);
                  bytes.push(b3 & 255);
                }
              } else {
                bytes.push(unknownChar);
              }
            }
          }
          return bytes;
        };
      };
      var QRMode = {
        MODE_NUMBER: 1 << 0,
        MODE_ALPHA_NUM: 1 << 1,
        MODE_8BIT_BYTE: 1 << 2,
        MODE_KANJI: 1 << 3
      };
      var QRErrorCorrectionLevel = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      };
      var QRMaskPattern = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      var QRUtil = (function() {
        var PATTERN_POSITION_TABLE = [
          [],
          [6, 18],
          [6, 22],
          [6, 26],
          [6, 30],
          [6, 34],
          [6, 22, 38],
          [6, 24, 42],
          [6, 26, 46],
          [6, 28, 50],
          [6, 30, 54],
          [6, 32, 58],
          [6, 34, 62],
          [6, 26, 46, 66],
          [6, 26, 48, 70],
          [6, 26, 50, 74],
          [6, 30, 54, 78],
          [6, 30, 56, 82],
          [6, 30, 58, 86],
          [6, 34, 62, 90],
          [6, 28, 50, 72, 94],
          [6, 26, 50, 74, 98],
          [6, 30, 54, 78, 102],
          [6, 28, 54, 80, 106],
          [6, 32, 58, 84, 110],
          [6, 30, 58, 86, 114],
          [6, 34, 62, 90, 118],
          [6, 26, 50, 74, 98, 122],
          [6, 30, 54, 78, 102, 126],
          [6, 26, 52, 78, 104, 130],
          [6, 30, 56, 82, 108, 134],
          [6, 34, 60, 86, 112, 138],
          [6, 30, 58, 86, 114, 142],
          [6, 34, 62, 90, 118, 146],
          [6, 30, 54, 78, 102, 126, 150],
          [6, 24, 50, 76, 102, 128, 154],
          [6, 28, 54, 80, 106, 132, 158],
          [6, 32, 58, 84, 110, 136, 162],
          [6, 26, 54, 82, 110, 138, 166],
          [6, 30, 58, 86, 114, 142, 170]
        ];
        var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
        var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
        var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
        var _this = {};
        var getBCHDigit = function(data) {
          var digit = 0;
          while (data != 0) {
            digit += 1;
            data >>>= 1;
          }
          return digit;
        };
        _this.getBCHTypeInfo = function(data) {
          var d3 = data << 10;
          while (getBCHDigit(d3) - getBCHDigit(G15) >= 0) {
            d3 ^= G15 << getBCHDigit(d3) - getBCHDigit(G15);
          }
          return (data << 10 | d3) ^ G15_MASK;
        };
        _this.getBCHTypeNumber = function(data) {
          var d3 = data << 12;
          while (getBCHDigit(d3) - getBCHDigit(G18) >= 0) {
            d3 ^= G18 << getBCHDigit(d3) - getBCHDigit(G18);
          }
          return data << 12 | d3;
        };
        _this.getPatternPosition = function(typeNumber) {
          return PATTERN_POSITION_TABLE[typeNumber - 1];
        };
        _this.getMaskFunction = function(maskPattern) {
          switch (maskPattern) {
            case QRMaskPattern.PATTERN000:
              return function(i, j) {
                return (i + j) % 2 == 0;
              };
            case QRMaskPattern.PATTERN001:
              return function(i, j) {
                return i % 2 == 0;
              };
            case QRMaskPattern.PATTERN010:
              return function(i, j) {
                return j % 3 == 0;
              };
            case QRMaskPattern.PATTERN011:
              return function(i, j) {
                return (i + j) % 3 == 0;
              };
            case QRMaskPattern.PATTERN100:
              return function(i, j) {
                return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
              };
            case QRMaskPattern.PATTERN101:
              return function(i, j) {
                return i * j % 2 + i * j % 3 == 0;
              };
            case QRMaskPattern.PATTERN110:
              return function(i, j) {
                return (i * j % 2 + i * j % 3) % 2 == 0;
              };
            case QRMaskPattern.PATTERN111:
              return function(i, j) {
                return (i * j % 3 + (i + j) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + maskPattern;
          }
        };
        _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
          var a5 = qrPolynomial([1], 0);
          for (var i = 0; i < errorCorrectLength; i += 1) {
            a5 = a5.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
          }
          return a5;
        };
        _this.getLengthInBits = function(mode, type) {
          if (1 <= type && type < 10) {
            switch (mode) {
              case QRMode.MODE_NUMBER:
                return 10;
              case QRMode.MODE_ALPHA_NUM:
                return 9;
              case QRMode.MODE_8BIT_BYTE:
                return 8;
              case QRMode.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + mode;
            }
          } else if (type < 27) {
            switch (mode) {
              case QRMode.MODE_NUMBER:
                return 12;
              case QRMode.MODE_ALPHA_NUM:
                return 11;
              case QRMode.MODE_8BIT_BYTE:
                return 16;
              case QRMode.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + mode;
            }
          } else if (type < 41) {
            switch (mode) {
              case QRMode.MODE_NUMBER:
                return 14;
              case QRMode.MODE_ALPHA_NUM:
                return 13;
              case QRMode.MODE_8BIT_BYTE:
                return 16;
              case QRMode.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + mode;
            }
          } else {
            throw "type:" + type;
          }
        };
        _this.getLostPoint = function(qrcode3) {
          var moduleCount = qrcode3.getModuleCount();
          var lostPoint = 0;
          for (var row = 0; row < moduleCount; row += 1) {
            for (var col = 0; col < moduleCount; col += 1) {
              var sameCount = 0;
              var dark = qrcode3.isDark(row, col);
              for (var r3 = -1; r3 <= 1; r3 += 1) {
                if (row + r3 < 0 || moduleCount <= row + r3) {
                  continue;
                }
                for (var c3 = -1; c3 <= 1; c3 += 1) {
                  if (col + c3 < 0 || moduleCount <= col + c3) {
                    continue;
                  }
                  if (r3 == 0 && c3 == 0) {
                    continue;
                  }
                  if (dark == qrcode3.isDark(row + r3, col + c3)) {
                    sameCount += 1;
                  }
                }
              }
              if (sameCount > 5) {
                lostPoint += 3 + sameCount - 5;
              }
            }
          }
          ;
          for (var row = 0; row < moduleCount - 1; row += 1) {
            for (var col = 0; col < moduleCount - 1; col += 1) {
              var count = 0;
              if (qrcode3.isDark(row, col)) count += 1;
              if (qrcode3.isDark(row + 1, col)) count += 1;
              if (qrcode3.isDark(row, col + 1)) count += 1;
              if (qrcode3.isDark(row + 1, col + 1)) count += 1;
              if (count == 0 || count == 4) {
                lostPoint += 3;
              }
            }
          }
          for (var row = 0; row < moduleCount; row += 1) {
            for (var col = 0; col < moduleCount - 6; col += 1) {
              if (qrcode3.isDark(row, col) && !qrcode3.isDark(row, col + 1) && qrcode3.isDark(row, col + 2) && qrcode3.isDark(row, col + 3) && qrcode3.isDark(row, col + 4) && !qrcode3.isDark(row, col + 5) && qrcode3.isDark(row, col + 6)) {
                lostPoint += 40;
              }
            }
          }
          for (var col = 0; col < moduleCount; col += 1) {
            for (var row = 0; row < moduleCount - 6; row += 1) {
              if (qrcode3.isDark(row, col) && !qrcode3.isDark(row + 1, col) && qrcode3.isDark(row + 2, col) && qrcode3.isDark(row + 3, col) && qrcode3.isDark(row + 4, col) && !qrcode3.isDark(row + 5, col) && qrcode3.isDark(row + 6, col)) {
                lostPoint += 40;
              }
            }
          }
          var darkCount = 0;
          for (var col = 0; col < moduleCount; col += 1) {
            for (var row = 0; row < moduleCount; row += 1) {
              if (qrcode3.isDark(row, col)) {
                darkCount += 1;
              }
            }
          }
          var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
          lostPoint += ratio * 10;
          return lostPoint;
        };
        return _this;
      })();
      var QRMath = (function() {
        var EXP_TABLE = new Array(256);
        var LOG_TABLE = new Array(256);
        for (var i = 0; i < 8; i += 1) {
          EXP_TABLE[i] = 1 << i;
        }
        for (var i = 8; i < 256; i += 1) {
          EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
        }
        for (var i = 0; i < 255; i += 1) {
          LOG_TABLE[EXP_TABLE[i]] = i;
        }
        var _this = {};
        _this.glog = function(n2) {
          if (n2 < 1) {
            throw "glog(" + n2 + ")";
          }
          return LOG_TABLE[n2];
        };
        _this.gexp = function(n2) {
          while (n2 < 0) {
            n2 += 255;
          }
          while (n2 >= 256) {
            n2 -= 255;
          }
          return EXP_TABLE[n2];
        };
        return _this;
      })();
      function qrPolynomial(num, shift) {
        if (typeof num.length == "undefined") {
          throw num.length + "/" + shift;
        }
        var _num = (function() {
          var offset = 0;
          while (offset < num.length && num[offset] == 0) {
            offset += 1;
          }
          var _num2 = new Array(num.length - offset + shift);
          for (var i = 0; i < num.length - offset; i += 1) {
            _num2[i] = num[i + offset];
          }
          return _num2;
        })();
        var _this = {};
        _this.getAt = function(index) {
          return _num[index];
        };
        _this.getLength = function() {
          return _num.length;
        };
        _this.multiply = function(e5) {
          var num2 = new Array(_this.getLength() + e5.getLength() - 1);
          for (var i = 0; i < _this.getLength(); i += 1) {
            for (var j = 0; j < e5.getLength(); j += 1) {
              num2[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e5.getAt(j)));
            }
          }
          return qrPolynomial(num2, 0);
        };
        _this.mod = function(e5) {
          if (_this.getLength() - e5.getLength() < 0) {
            return _this;
          }
          var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e5.getAt(0));
          var num2 = new Array(_this.getLength());
          for (var i = 0; i < _this.getLength(); i += 1) {
            num2[i] = _this.getAt(i);
          }
          for (var i = 0; i < e5.getLength(); i += 1) {
            num2[i] ^= QRMath.gexp(QRMath.glog(e5.getAt(i)) + ratio);
          }
          return qrPolynomial(num2, 0).mod(e5);
        };
        return _this;
      }
      ;
      var QRRSBlock = (function() {
        var RS_BLOCK_TABLE = [
          // L
          // M
          // Q
          // H
          // 1
          [1, 26, 19],
          [1, 26, 16],
          [1, 26, 13],
          [1, 26, 9],
          // 2
          [1, 44, 34],
          [1, 44, 28],
          [1, 44, 22],
          [1, 44, 16],
          // 3
          [1, 70, 55],
          [1, 70, 44],
          [2, 35, 17],
          [2, 35, 13],
          // 4
          [1, 100, 80],
          [2, 50, 32],
          [2, 50, 24],
          [4, 25, 9],
          // 5
          [1, 134, 108],
          [2, 67, 43],
          [2, 33, 15, 2, 34, 16],
          [2, 33, 11, 2, 34, 12],
          // 6
          [2, 86, 68],
          [4, 43, 27],
          [4, 43, 19],
          [4, 43, 15],
          // 7
          [2, 98, 78],
          [4, 49, 31],
          [2, 32, 14, 4, 33, 15],
          [4, 39, 13, 1, 40, 14],
          // 8
          [2, 121, 97],
          [2, 60, 38, 2, 61, 39],
          [4, 40, 18, 2, 41, 19],
          [4, 40, 14, 2, 41, 15],
          // 9
          [2, 146, 116],
          [3, 58, 36, 2, 59, 37],
          [4, 36, 16, 4, 37, 17],
          [4, 36, 12, 4, 37, 13],
          // 10
          [2, 86, 68, 2, 87, 69],
          [4, 69, 43, 1, 70, 44],
          [6, 43, 19, 2, 44, 20],
          [6, 43, 15, 2, 44, 16],
          // 11
          [4, 101, 81],
          [1, 80, 50, 4, 81, 51],
          [4, 50, 22, 4, 51, 23],
          [3, 36, 12, 8, 37, 13],
          // 12
          [2, 116, 92, 2, 117, 93],
          [6, 58, 36, 2, 59, 37],
          [4, 46, 20, 6, 47, 21],
          [7, 42, 14, 4, 43, 15],
          // 13
          [4, 133, 107],
          [8, 59, 37, 1, 60, 38],
          [8, 44, 20, 4, 45, 21],
          [12, 33, 11, 4, 34, 12],
          // 14
          [3, 145, 115, 1, 146, 116],
          [4, 64, 40, 5, 65, 41],
          [11, 36, 16, 5, 37, 17],
          [11, 36, 12, 5, 37, 13],
          // 15
          [5, 109, 87, 1, 110, 88],
          [5, 65, 41, 5, 66, 42],
          [5, 54, 24, 7, 55, 25],
          [11, 36, 12, 7, 37, 13],
          // 16
          [5, 122, 98, 1, 123, 99],
          [7, 73, 45, 3, 74, 46],
          [15, 43, 19, 2, 44, 20],
          [3, 45, 15, 13, 46, 16],
          // 17
          [1, 135, 107, 5, 136, 108],
          [10, 74, 46, 1, 75, 47],
          [1, 50, 22, 15, 51, 23],
          [2, 42, 14, 17, 43, 15],
          // 18
          [5, 150, 120, 1, 151, 121],
          [9, 69, 43, 4, 70, 44],
          [17, 50, 22, 1, 51, 23],
          [2, 42, 14, 19, 43, 15],
          // 19
          [3, 141, 113, 4, 142, 114],
          [3, 70, 44, 11, 71, 45],
          [17, 47, 21, 4, 48, 22],
          [9, 39, 13, 16, 40, 14],
          // 20
          [3, 135, 107, 5, 136, 108],
          [3, 67, 41, 13, 68, 42],
          [15, 54, 24, 5, 55, 25],
          [15, 43, 15, 10, 44, 16],
          // 21
          [4, 144, 116, 4, 145, 117],
          [17, 68, 42],
          [17, 50, 22, 6, 51, 23],
          [19, 46, 16, 6, 47, 17],
          // 22
          [2, 139, 111, 7, 140, 112],
          [17, 74, 46],
          [7, 54, 24, 16, 55, 25],
          [34, 37, 13],
          // 23
          [4, 151, 121, 5, 152, 122],
          [4, 75, 47, 14, 76, 48],
          [11, 54, 24, 14, 55, 25],
          [16, 45, 15, 14, 46, 16],
          // 24
          [6, 147, 117, 4, 148, 118],
          [6, 73, 45, 14, 74, 46],
          [11, 54, 24, 16, 55, 25],
          [30, 46, 16, 2, 47, 17],
          // 25
          [8, 132, 106, 4, 133, 107],
          [8, 75, 47, 13, 76, 48],
          [7, 54, 24, 22, 55, 25],
          [22, 45, 15, 13, 46, 16],
          // 26
          [10, 142, 114, 2, 143, 115],
          [19, 74, 46, 4, 75, 47],
          [28, 50, 22, 6, 51, 23],
          [33, 46, 16, 4, 47, 17],
          // 27
          [8, 152, 122, 4, 153, 123],
          [22, 73, 45, 3, 74, 46],
          [8, 53, 23, 26, 54, 24],
          [12, 45, 15, 28, 46, 16],
          // 28
          [3, 147, 117, 10, 148, 118],
          [3, 73, 45, 23, 74, 46],
          [4, 54, 24, 31, 55, 25],
          [11, 45, 15, 31, 46, 16],
          // 29
          [7, 146, 116, 7, 147, 117],
          [21, 73, 45, 7, 74, 46],
          [1, 53, 23, 37, 54, 24],
          [19, 45, 15, 26, 46, 16],
          // 30
          [5, 145, 115, 10, 146, 116],
          [19, 75, 47, 10, 76, 48],
          [15, 54, 24, 25, 55, 25],
          [23, 45, 15, 25, 46, 16],
          // 31
          [13, 145, 115, 3, 146, 116],
          [2, 74, 46, 29, 75, 47],
          [42, 54, 24, 1, 55, 25],
          [23, 45, 15, 28, 46, 16],
          // 32
          [17, 145, 115],
          [10, 74, 46, 23, 75, 47],
          [10, 54, 24, 35, 55, 25],
          [19, 45, 15, 35, 46, 16],
          // 33
          [17, 145, 115, 1, 146, 116],
          [14, 74, 46, 21, 75, 47],
          [29, 54, 24, 19, 55, 25],
          [11, 45, 15, 46, 46, 16],
          // 34
          [13, 145, 115, 6, 146, 116],
          [14, 74, 46, 23, 75, 47],
          [44, 54, 24, 7, 55, 25],
          [59, 46, 16, 1, 47, 17],
          // 35
          [12, 151, 121, 7, 152, 122],
          [12, 75, 47, 26, 76, 48],
          [39, 54, 24, 14, 55, 25],
          [22, 45, 15, 41, 46, 16],
          // 36
          [6, 151, 121, 14, 152, 122],
          [6, 75, 47, 34, 76, 48],
          [46, 54, 24, 10, 55, 25],
          [2, 45, 15, 64, 46, 16],
          // 37
          [17, 152, 122, 4, 153, 123],
          [29, 74, 46, 14, 75, 47],
          [49, 54, 24, 10, 55, 25],
          [24, 45, 15, 46, 46, 16],
          // 38
          [4, 152, 122, 18, 153, 123],
          [13, 74, 46, 32, 75, 47],
          [48, 54, 24, 14, 55, 25],
          [42, 45, 15, 32, 46, 16],
          // 39
          [20, 147, 117, 4, 148, 118],
          [40, 75, 47, 7, 76, 48],
          [43, 54, 24, 22, 55, 25],
          [10, 45, 15, 67, 46, 16],
          // 40
          [19, 148, 118, 6, 149, 119],
          [18, 75, 47, 31, 76, 48],
          [34, 54, 24, 34, 55, 25],
          [20, 45, 15, 61, 46, 16]
        ];
        var qrRSBlock = function(totalCount, dataCount) {
          var _this2 = {};
          _this2.totalCount = totalCount;
          _this2.dataCount = dataCount;
          return _this2;
        };
        var _this = {};
        var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
          switch (errorCorrectionLevel) {
            case QRErrorCorrectionLevel.L:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
            case QRErrorCorrectionLevel.M:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
            case QRErrorCorrectionLevel.Q:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
            case QRErrorCorrectionLevel.H:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
            default:
              return void 0;
          }
        };
        _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
          var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
          if (typeof rsBlock == "undefined") {
            throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
          }
          var length = rsBlock.length / 3;
          var list = [];
          for (var i = 0; i < length; i += 1) {
            var count = rsBlock[i * 3 + 0];
            var totalCount = rsBlock[i * 3 + 1];
            var dataCount = rsBlock[i * 3 + 2];
            for (var j = 0; j < count; j += 1) {
              list.push(qrRSBlock(totalCount, dataCount));
            }
          }
          return list;
        };
        return _this;
      })();
      var qrBitBuffer = function() {
        var _buffer = [];
        var _length = 0;
        var _this = {};
        _this.getBuffer = function() {
          return _buffer;
        };
        _this.getAt = function(index) {
          var bufIndex = Math.floor(index / 8);
          return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
        };
        _this.put = function(num, length) {
          for (var i = 0; i < length; i += 1) {
            _this.putBit((num >>> length - i - 1 & 1) == 1);
          }
        };
        _this.getLengthInBits = function() {
          return _length;
        };
        _this.putBit = function(bit) {
          var bufIndex = Math.floor(_length / 8);
          if (_buffer.length <= bufIndex) {
            _buffer.push(0);
          }
          if (bit) {
            _buffer[bufIndex] |= 128 >>> _length % 8;
          }
          _length += 1;
        };
        return _this;
      };
      var qrNumber = function(data) {
        var _mode = QRMode.MODE_NUMBER;
        var _data = data;
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return _data.length;
        };
        _this.write = function(buffer) {
          var data2 = _data;
          var i = 0;
          while (i + 2 < data2.length) {
            buffer.put(strToNum(data2.substring(i, i + 3)), 10);
            i += 3;
          }
          if (i < data2.length) {
            if (data2.length - i == 1) {
              buffer.put(strToNum(data2.substring(i, i + 1)), 4);
            } else if (data2.length - i == 2) {
              buffer.put(strToNum(data2.substring(i, i + 2)), 7);
            }
          }
        };
        var strToNum = function(s2) {
          var num = 0;
          for (var i = 0; i < s2.length; i += 1) {
            num = num * 10 + chatToNum(s2.charAt(i));
          }
          return num;
        };
        var chatToNum = function(c3) {
          if ("0" <= c3 && c3 <= "9") {
            return c3.charCodeAt(0) - "0".charCodeAt(0);
          }
          throw "illegal char :" + c3;
        };
        return _this;
      };
      var qrAlphaNum = function(data) {
        var _mode = QRMode.MODE_ALPHA_NUM;
        var _data = data;
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return _data.length;
        };
        _this.write = function(buffer) {
          var s2 = _data;
          var i = 0;
          while (i + 1 < s2.length) {
            buffer.put(
              getCode(s2.charAt(i)) * 45 + getCode(s2.charAt(i + 1)),
              11
            );
            i += 2;
          }
          if (i < s2.length) {
            buffer.put(getCode(s2.charAt(i)), 6);
          }
        };
        var getCode = function(c3) {
          if ("0" <= c3 && c3 <= "9") {
            return c3.charCodeAt(0) - "0".charCodeAt(0);
          } else if ("A" <= c3 && c3 <= "Z") {
            return c3.charCodeAt(0) - "A".charCodeAt(0) + 10;
          } else {
            switch (c3) {
              case " ":
                return 36;
              case "$":
                return 37;
              case "%":
                return 38;
              case "*":
                return 39;
              case "+":
                return 40;
              case "-":
                return 41;
              case ".":
                return 42;
              case "/":
                return 43;
              case ":":
                return 44;
              default:
                throw "illegal char :" + c3;
            }
          }
        };
        return _this;
      };
      var qr8BitByte = function(data) {
        var _mode = QRMode.MODE_8BIT_BYTE;
        var _data = data;
        var _bytes = qrcode2.stringToBytes(data);
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return _bytes.length;
        };
        _this.write = function(buffer) {
          for (var i = 0; i < _bytes.length; i += 1) {
            buffer.put(_bytes[i], 8);
          }
        };
        return _this;
      };
      var qrKanji = function(data) {
        var _mode = QRMode.MODE_KANJI;
        var _data = data;
        var stringToBytes = qrcode2.stringToBytesFuncs["SJIS"];
        if (!stringToBytes) {
          throw "sjis not supported.";
        }
        !(function(c3, code) {
          var test = stringToBytes(c3);
          if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
            throw "sjis not supported.";
          }
        })("\u53CB", 38726);
        var _bytes = stringToBytes(data);
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return ~~(_bytes.length / 2);
        };
        _this.write = function(buffer) {
          var data2 = _bytes;
          var i = 0;
          while (i + 1 < data2.length) {
            var c3 = (255 & data2[i]) << 8 | 255 & data2[i + 1];
            if (33088 <= c3 && c3 <= 40956) {
              c3 -= 33088;
            } else if (57408 <= c3 && c3 <= 60351) {
              c3 -= 49472;
            } else {
              throw "illegal char at " + (i + 1) + "/" + c3;
            }
            c3 = (c3 >>> 8 & 255) * 192 + (c3 & 255);
            buffer.put(c3, 13);
            i += 2;
          }
          if (i < data2.length) {
            throw "illegal char at " + (i + 1);
          }
        };
        return _this;
      };
      var byteArrayOutputStream = function() {
        var _bytes = [];
        var _this = {};
        _this.writeByte = function(b3) {
          _bytes.push(b3 & 255);
        };
        _this.writeShort = function(i) {
          _this.writeByte(i);
          _this.writeByte(i >>> 8);
        };
        _this.writeBytes = function(b3, off, len) {
          off = off || 0;
          len = len || b3.length;
          for (var i = 0; i < len; i += 1) {
            _this.writeByte(b3[i + off]);
          }
        };
        _this.writeString = function(s2) {
          for (var i = 0; i < s2.length; i += 1) {
            _this.writeByte(s2.charCodeAt(i));
          }
        };
        _this.toByteArray = function() {
          return _bytes;
        };
        _this.toString = function() {
          var s2 = "";
          s2 += "[";
          for (var i = 0; i < _bytes.length; i += 1) {
            if (i > 0) {
              s2 += ",";
            }
            s2 += _bytes[i];
          }
          s2 += "]";
          return s2;
        };
        return _this;
      };
      var base64EncodeOutputStream = function() {
        var _buffer = 0;
        var _buflen = 0;
        var _length = 0;
        var _base64 = "";
        var _this = {};
        var writeEncoded = function(b3) {
          _base64 += String.fromCharCode(encode(b3 & 63));
        };
        var encode = function(n2) {
          if (n2 < 0) {
          } else if (n2 < 26) {
            return 65 + n2;
          } else if (n2 < 52) {
            return 97 + (n2 - 26);
          } else if (n2 < 62) {
            return 48 + (n2 - 52);
          } else if (n2 == 62) {
            return 43;
          } else if (n2 == 63) {
            return 47;
          }
          throw "n:" + n2;
        };
        _this.writeByte = function(n2) {
          _buffer = _buffer << 8 | n2 & 255;
          _buflen += 8;
          _length += 1;
          while (_buflen >= 6) {
            writeEncoded(_buffer >>> _buflen - 6);
            _buflen -= 6;
          }
        };
        _this.flush = function() {
          if (_buflen > 0) {
            writeEncoded(_buffer << 6 - _buflen);
            _buffer = 0;
            _buflen = 0;
          }
          if (_length % 3 != 0) {
            var padlen = 3 - _length % 3;
            for (var i = 0; i < padlen; i += 1) {
              _base64 += "=";
            }
          }
        };
        _this.toString = function() {
          return _base64;
        };
        return _this;
      };
      var base64DecodeInputStream = function(str) {
        var _str = str;
        var _pos = 0;
        var _buffer = 0;
        var _buflen = 0;
        var _this = {};
        _this.read = function() {
          while (_buflen < 8) {
            if (_pos >= _str.length) {
              if (_buflen == 0) {
                return -1;
              }
              throw "unexpected end of file./" + _buflen;
            }
            var c3 = _str.charAt(_pos);
            _pos += 1;
            if (c3 == "=") {
              _buflen = 0;
              return -1;
            } else if (c3.match(/^\s$/)) {
              continue;
            }
            _buffer = _buffer << 6 | decode(c3.charCodeAt(0));
            _buflen += 6;
          }
          var n2 = _buffer >>> _buflen - 8 & 255;
          _buflen -= 8;
          return n2;
        };
        var decode = function(c3) {
          if (65 <= c3 && c3 <= 90) {
            return c3 - 65;
          } else if (97 <= c3 && c3 <= 122) {
            return c3 - 97 + 26;
          } else if (48 <= c3 && c3 <= 57) {
            return c3 - 48 + 52;
          } else if (c3 == 43) {
            return 62;
          } else if (c3 == 47) {
            return 63;
          } else {
            throw "c:" + c3;
          }
        };
        return _this;
      };
      var gifImage = function(width, height) {
        var _width = width;
        var _height = height;
        var _data = new Array(width * height);
        var _this = {};
        _this.setPixel = function(x, y2, pixel) {
          _data[y2 * _width + x] = pixel;
        };
        _this.write = function(out) {
          out.writeString("GIF87a");
          out.writeShort(_width);
          out.writeShort(_height);
          out.writeByte(128);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(255);
          out.writeByte(255);
          out.writeByte(255);
          out.writeString(",");
          out.writeShort(0);
          out.writeShort(0);
          out.writeShort(_width);
          out.writeShort(_height);
          out.writeByte(0);
          var lzwMinCodeSize = 2;
          var raster = getLZWRaster(lzwMinCodeSize);
          out.writeByte(lzwMinCodeSize);
          var offset = 0;
          while (raster.length - offset > 255) {
            out.writeByte(255);
            out.writeBytes(raster, offset, 255);
            offset += 255;
          }
          out.writeByte(raster.length - offset);
          out.writeBytes(raster, offset, raster.length - offset);
          out.writeByte(0);
          out.writeString(";");
        };
        var bitOutputStream = function(out) {
          var _out = out;
          var _bitLength = 0;
          var _bitBuffer = 0;
          var _this2 = {};
          _this2.write = function(data, length) {
            if (data >>> length != 0) {
              throw "length over";
            }
            while (_bitLength + length >= 8) {
              _out.writeByte(255 & (data << _bitLength | _bitBuffer));
              length -= 8 - _bitLength;
              data >>>= 8 - _bitLength;
              _bitBuffer = 0;
              _bitLength = 0;
            }
            _bitBuffer = data << _bitLength | _bitBuffer;
            _bitLength = _bitLength + length;
          };
          _this2.flush = function() {
            if (_bitLength > 0) {
              _out.writeByte(_bitBuffer);
            }
          };
          return _this2;
        };
        var getLZWRaster = function(lzwMinCodeSize) {
          var clearCode = 1 << lzwMinCodeSize;
          var endCode = (1 << lzwMinCodeSize) + 1;
          var bitLength = lzwMinCodeSize + 1;
          var table = lzwTable();
          for (var i = 0; i < clearCode; i += 1) {
            table.add(String.fromCharCode(i));
          }
          table.add(String.fromCharCode(clearCode));
          table.add(String.fromCharCode(endCode));
          var byteOut = byteArrayOutputStream();
          var bitOut = bitOutputStream(byteOut);
          bitOut.write(clearCode, bitLength);
          var dataIndex = 0;
          var s2 = String.fromCharCode(_data[dataIndex]);
          dataIndex += 1;
          while (dataIndex < _data.length) {
            var c3 = String.fromCharCode(_data[dataIndex]);
            dataIndex += 1;
            if (table.contains(s2 + c3)) {
              s2 = s2 + c3;
            } else {
              bitOut.write(table.indexOf(s2), bitLength);
              if (table.size() < 4095) {
                if (table.size() == 1 << bitLength) {
                  bitLength += 1;
                }
                table.add(s2 + c3);
              }
              s2 = c3;
            }
          }
          bitOut.write(table.indexOf(s2), bitLength);
          bitOut.write(endCode, bitLength);
          bitOut.flush();
          return byteOut.toByteArray();
        };
        var lzwTable = function() {
          var _map = {};
          var _size = 0;
          var _this2 = {};
          _this2.add = function(key) {
            if (_this2.contains(key)) {
              throw "dup key:" + key;
            }
            _map[key] = _size;
            _size += 1;
          };
          _this2.size = function() {
            return _size;
          };
          _this2.indexOf = function(key) {
            return _map[key];
          };
          _this2.contains = function(key) {
            return typeof _map[key] != "undefined";
          };
          return _this2;
        };
        return _this;
      };
      var createDataURL = function(width, height, getPixel) {
        var gif = gifImage(width, height);
        for (var y2 = 0; y2 < height; y2 += 1) {
          for (var x = 0; x < width; x += 1) {
            gif.setPixel(x, y2, getPixel(x, y2));
          }
        }
        var b3 = byteArrayOutputStream();
        gif.write(b3);
        var base64 = base64EncodeOutputStream();
        var bytes = b3.toByteArray();
        for (var i = 0; i < bytes.length; i += 1) {
          base64.writeByte(bytes[i]);
        }
        base64.flush();
        return "data:image/gif;base64," + base64;
      };
      return qrcode2;
    })();
    !(function() {
      qrcode.stringToBytesFuncs["UTF-8"] = function(s2) {
        function toUTF8Array(str) {
          var utf8 = [];
          for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 128) utf8.push(charcode);
            else if (charcode < 2048) {
              utf8.push(
                192 | charcode >> 6,
                128 | charcode & 63
              );
            } else if (charcode < 55296 || charcode >= 57344) {
              utf8.push(
                224 | charcode >> 12,
                128 | charcode >> 6 & 63,
                128 | charcode & 63
              );
            } else {
              i++;
              charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
              utf8.push(
                240 | charcode >> 18,
                128 | charcode >> 12 & 63,
                128 | charcode >> 6 & 63,
                128 | charcode & 63
              );
            }
          }
          return utf8;
        }
        return toUTF8Array(s2);
      };
    })();
    (function(factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof exports === "object") {
        module.exports = factory();
      }
    })(function() {
      return qrcode;
    });
  }
});

// node_modules/custom-qr-code/dist/esm/core/CustomQRCode.js
var import_qrcode_generator = __toESM(require_qrcode(), 1);

// node_modules/custom-qr-code/dist/esm/core/constants/errorCorrectionPercents.js
var r = {
  L: 0.07,
  M: 0.15,
  Q: 0.25,
  H: 0.3
};

// node_modules/custom-qr-code/dist/esm/core/constants/gradientTypes.js
var a = {
  radial: "radial"
};

// node_modules/custom-qr-code/dist/esm/core/constants/cornerDotTypes.js
var e = {
  dot: "dot",
  square: "square"
};

// node_modules/custom-qr-code/dist/esm/core/figures/cornerDot/canvas/QRCornerDot.js
var u = Object.defineProperty;
var d = (c3, t3, e5) => t3 in c3 ? u(c3, t3, { enumerable: true, configurable: true, writable: true, value: e5 }) : c3[t3] = e5;
var _ = (c3, t3, e5) => d(c3, typeof t3 != "symbol" ? t3 + "" : t3, e5);
var p = class {
  constructor({ context: t3, type: e5 }) {
    _(this, "_context");
    _(this, "_type");
    this._context = t3, this._type = e5;
  }
  draw(t3, e5, a5, s2) {
    const r3 = this._context, i = this._type;
    let o3;
    switch (i) {
      case e.square:
        o3 = this._drawSquare;
        break;
      case e.dot:
      default:
        o3 = this._drawDot;
    }
    o3.call(this, { x: t3, y: e5, size: a5, context: r3, rotation: s2 });
  }
  _rotateFigure({ x: t3, y: e5, size: a5, context: s2, rotation: r3 = 0, draw: i }) {
    const o3 = t3 + a5 / 2, h2 = e5 + a5 / 2;
    s2.translate(o3, h2), r3 && s2.rotate(r3), i(), s2.closePath(), r3 && s2.rotate(-r3), s2.translate(-o3, -h2);
  }
  _basicDot(t3) {
    const { size: e5, context: a5 } = t3;
    this._rotateFigure({
      ...t3,
      draw: () => {
        a5.arc(0, 0, e5 / 2, 0, Math.PI * 2);
      }
    });
  }
  _basicSquare(t3) {
    const { size: e5, context: a5 } = t3;
    this._rotateFigure({
      ...t3,
      draw: () => {
        a5.rect(-e5 / 2, -e5 / 2, e5, e5);
      }
    });
  }
  _drawDot({ x: t3, y: e5, size: a5, context: s2, rotation: r3 }) {
    this._basicDot({ x: t3, y: e5, size: a5, context: s2, rotation: r3 });
  }
  _drawSquare({ x: t3, y: e5, size: a5, context: s2, rotation: r3 }) {
    this._basicSquare({ x: t3, y: e5, size: a5, context: s2, rotation: r3 });
  }
};

// node_modules/custom-qr-code/dist/esm/core/constants/cornerSquareTypes.js
var e2 = {
  dot: "dot",
  square: "square",
  extraRounded: "extra-rounded"
};

// node_modules/custom-qr-code/dist/esm/core/figures/cornerSquare/canvas/QRCornerSquare.js
var _2 = Object.defineProperty;
var u2 = (s2, r3, e5) => r3 in s2 ? _2(s2, r3, { enumerable: true, configurable: true, writable: true, value: e5 }) : s2[r3] = e5;
var h = (s2, r3, e5) => u2(s2, typeof r3 != "symbol" ? r3 + "" : r3, e5);
var I = class {
  constructor({ context: r3, type: e5 }) {
    h(this, "_context");
    h(this, "_type");
    this._context = r3, this._type = e5;
  }
  draw(r3, e5, a5, t3) {
    const c3 = this._context, i = this._type;
    let o3;
    switch (i) {
      case e2.square:
        o3 = this._drawSquare;
        break;
      case e2.extraRounded:
        o3 = this._drawExtraRounded;
        break;
      case e2.dot:
      default:
        o3 = this._drawDot;
    }
    o3.call(this, { x: r3, y: e5, size: a5, context: c3, rotation: t3 });
  }
  _rotateFigure({ x: r3, y: e5, size: a5, context: t3, rotation: c3 = 0, draw: i }) {
    const o3 = r3 + a5 / 2, d3 = e5 + a5 / 2;
    t3.translate(o3, d3), c3 && t3.rotate(c3), i(), t3.closePath(), c3 && t3.rotate(-c3), t3.translate(-o3, -d3);
  }
  _basicDot(r3) {
    const { size: e5, context: a5 } = r3, t3 = e5 / 7;
    this._rotateFigure({
      ...r3,
      draw: () => {
        a5.arc(0, 0, e5 / 2, 0, Math.PI * 2), a5.arc(0, 0, e5 / 2 - t3, 0, Math.PI * 2);
      }
    });
  }
  _basicSquare(r3) {
    const { size: e5, context: a5 } = r3, t3 = e5 / 7;
    this._rotateFigure({
      ...r3,
      draw: () => {
        a5.rect(-e5 / 2, -e5 / 2, e5, e5), a5.rect(-e5 / 2 + t3, -e5 / 2 + t3, e5 - 2 * t3, e5 - 2 * t3);
      }
    });
  }
  _basicExtraRounded(r3) {
    const { size: e5, context: a5 } = r3, t3 = e5 / 7;
    this._rotateFigure({
      ...r3,
      draw: () => {
        a5.arc(-t3, -t3, 2.5 * t3, Math.PI, -Math.PI / 2), a5.lineTo(t3, -3.5 * t3), a5.arc(t3, -t3, 2.5 * t3, -Math.PI / 2, 0), a5.lineTo(3.5 * t3, -t3), a5.arc(t3, t3, 2.5 * t3, 0, Math.PI / 2), a5.lineTo(-t3, 3.5 * t3), a5.arc(-t3, t3, 2.5 * t3, Math.PI / 2, Math.PI), a5.lineTo(-3.5 * t3, -t3), a5.arc(-t3, -t3, 1.5 * t3, Math.PI, -Math.PI / 2), a5.lineTo(t3, -2.5 * t3), a5.arc(t3, -t3, 1.5 * t3, -Math.PI / 2, 0), a5.lineTo(2.5 * t3, -t3), a5.arc(t3, t3, 1.5 * t3, 0, Math.PI / 2), a5.lineTo(-t3, 2.5 * t3), a5.arc(-t3, t3, 1.5 * t3, Math.PI / 2, Math.PI), a5.lineTo(-2.5 * t3, -t3);
      }
    });
  }
  _drawDot({ x: r3, y: e5, size: a5, context: t3, rotation: c3 }) {
    this._basicDot({ x: r3, y: e5, size: a5, context: t3, rotation: c3 });
  }
  _drawSquare({ x: r3, y: e5, size: a5, context: t3, rotation: c3 }) {
    this._basicSquare({ x: r3, y: e5, size: a5, context: t3, rotation: c3 });
  }
  _drawExtraRounded({ x: r3, y: e5, size: a5, context: t3, rotation: c3 }) {
    this._basicExtraRounded({ x: r3, y: e5, size: a5, context: t3, rotation: c3 });
  }
};

// node_modules/custom-qr-code/dist/esm/core/constants/dotTypes.js
var d2 = {
  dots: "dots",
  rounded: "rounded",
  classy: "classy",
  classyRounded: "classy-rounded",
  square: "square",
  extraRounded: "extra-rounded"
};

// node_modules/custom-qr-code/dist/esm/core/figures/dot/canvas/QRDot.js
var f = Object.defineProperty;
var P = (u7, a5, t3) => a5 in u7 ? f(u7, a5, { enumerable: true, configurable: true, writable: true, value: t3 }) : u7[a5] = t3;
var l = (u7, a5, t3) => P(u7, typeof a5 != "symbol" ? a5 + "" : a5, t3);
var b = class {
  constructor({ context: a5, type: t3 }) {
    l(this, "_context");
    l(this, "_type");
    this._context = a5, this._type = t3;
  }
  draw(a5, t3, o3, s2) {
    const r3 = this._context, c3 = this._type;
    let i;
    switch (c3) {
      case d2.dots:
        i = this._drawDot;
        break;
      case d2.classy:
        i = this._drawClassy;
        break;
      case d2.classyRounded:
        i = this._drawClassyRounded;
        break;
      case d2.rounded:
        i = this._drawRounded;
        break;
      case d2.extraRounded:
        i = this._drawExtraRounded;
        break;
      case d2.square:
      default:
        i = this._drawSquare;
    }
    i.call(this, { x: a5, y: t3, size: o3, context: r3, getNeighbor: s2 });
  }
  _rotateFigure({ x: a5, y: t3, size: o3, context: s2, rotation: r3 = 0, draw: c3 }) {
    const i = a5 + o3 / 2, n2 = t3 + o3 / 2;
    s2.translate(i, n2), r3 && s2.rotate(r3), c3(), s2.closePath(), r3 && s2.rotate(-r3), s2.translate(-i, -n2);
  }
  _basicDot(a5) {
    const { size: t3, context: o3 } = a5;
    this._rotateFigure({
      ...a5,
      draw: () => {
        o3.arc(0, 0, t3 / 2, 0, Math.PI * 2);
      }
    });
  }
  _basicSquare(a5) {
    const { size: t3, context: o3 } = a5;
    this._rotateFigure({
      ...a5,
      draw: () => {
        o3.rect(-t3 / 2, -t3 / 2, t3, t3);
      }
    });
  }
  //if rotation === 0 - right side is rounded
  _basicSideRounded(a5) {
    const { size: t3, context: o3 } = a5;
    this._rotateFigure({
      ...a5,
      draw: () => {
        o3.arc(0, 0, t3 / 2, -Math.PI / 2, Math.PI / 2), o3.lineTo(-t3 / 2, t3 / 2), o3.lineTo(-t3 / 2, -t3 / 2), o3.lineTo(0, -t3 / 2);
      }
    });
  }
  //if rotation === 0 - top right corner is rounded
  _basicCornerRounded(a5) {
    const { size: t3, context: o3 } = a5;
    this._rotateFigure({
      ...a5,
      draw: () => {
        o3.arc(0, 0, t3 / 2, -Math.PI / 2, 0), o3.lineTo(t3 / 2, t3 / 2), o3.lineTo(-t3 / 2, t3 / 2), o3.lineTo(-t3 / 2, -t3 / 2), o3.lineTo(0, -t3 / 2);
      }
    });
  }
  //if rotation === 0 - top right corner is rounded
  _basicCornerExtraRounded(a5) {
    const { size: t3, context: o3 } = a5;
    this._rotateFigure({
      ...a5,
      draw: () => {
        o3.arc(-t3 / 2, t3 / 2, t3, -Math.PI / 2, 0), o3.lineTo(-t3 / 2, t3 / 2), o3.lineTo(-t3 / 2, -t3 / 2);
      }
    });
  }
  _basicCornersRounded(a5) {
    const { size: t3, context: o3 } = a5;
    this._rotateFigure({
      ...a5,
      draw: () => {
        o3.arc(0, 0, t3 / 2, -Math.PI / 2, 0), o3.lineTo(t3 / 2, t3 / 2), o3.lineTo(0, t3 / 2), o3.arc(0, 0, t3 / 2, Math.PI / 2, Math.PI), o3.lineTo(-t3 / 2, -t3 / 2), o3.lineTo(0, -t3 / 2);
      }
    });
  }
  _basicCornersExtraRounded(a5) {
    const { size: t3, context: o3 } = a5;
    this._rotateFigure({
      ...a5,
      draw: () => {
        o3.arc(-t3 / 2, t3 / 2, t3, -Math.PI / 2, 0), o3.arc(t3 / 2, -t3 / 2, t3, Math.PI / 2, Math.PI);
      }
    });
  }
  _drawDot({ x: a5, y: t3, size: o3, context: s2 }) {
    this._basicDot({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
  }
  _drawSquare({ x: a5, y: t3, size: o3, context: s2 }) {
    this._basicSquare({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
  }
  _drawRounded({ x: a5, y: t3, size: o3, context: s2, getNeighbor: r3 }) {
    const c3 = r3 ? +r3(-1, 0) : 0, i = r3 ? +r3(1, 0) : 0, n2 = r3 ? +r3(0, -1) : 0, d3 = r3 ? +r3(0, 1) : 0, h2 = c3 + i + n2 + d3;
    if (h2 === 0) {
      this._basicDot({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
      return;
    }
    if (h2 > 2 || c3 && i || n2 && d3) {
      this._basicSquare({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
      return;
    }
    if (h2 === 2) {
      let e5 = 0;
      c3 && n2 ? e5 = Math.PI / 2 : n2 && i ? e5 = Math.PI : i && d3 && (e5 = -Math.PI / 2), this._basicCornerRounded({ x: a5, y: t3, size: o3, context: s2, rotation: e5 });
      return;
    }
    if (h2 === 1) {
      let e5 = 0;
      n2 ? e5 = Math.PI / 2 : i ? e5 = Math.PI : d3 && (e5 = -Math.PI / 2), this._basicSideRounded({ x: a5, y: t3, size: o3, context: s2, rotation: e5 });
      return;
    }
  }
  _drawExtraRounded({ x: a5, y: t3, size: o3, context: s2, getNeighbor: r3 }) {
    const c3 = r3 ? +r3(-1, 0) : 0, i = r3 ? +r3(1, 0) : 0, n2 = r3 ? +r3(0, -1) : 0, d3 = r3 ? +r3(0, 1) : 0, h2 = c3 + i + n2 + d3;
    if (h2 === 0) {
      this._basicDot({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
      return;
    }
    if (h2 > 2 || c3 && i || n2 && d3) {
      this._basicSquare({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
      return;
    }
    if (h2 === 2) {
      let e5 = 0;
      c3 && n2 ? e5 = Math.PI / 2 : n2 && i ? e5 = Math.PI : i && d3 && (e5 = -Math.PI / 2), this._basicCornerExtraRounded({ x: a5, y: t3, size: o3, context: s2, rotation: e5 });
      return;
    }
    if (h2 === 1) {
      let e5 = 0;
      n2 ? e5 = Math.PI / 2 : i ? e5 = Math.PI : d3 && (e5 = -Math.PI / 2), this._basicSideRounded({ x: a5, y: t3, size: o3, context: s2, rotation: e5 });
      return;
    }
  }
  _drawClassy({ x: a5, y: t3, size: o3, context: s2, getNeighbor: r3 }) {
    const c3 = r3 ? +r3(-1, 0) : 0, i = r3 ? +r3(1, 0) : 0, n2 = r3 ? +r3(0, -1) : 0, d3 = r3 ? +r3(0, 1) : 0;
    if (c3 + i + n2 + d3 === 0) {
      this._basicCornersRounded({ x: a5, y: t3, size: o3, context: s2, rotation: Math.PI / 2 });
      return;
    }
    if (!c3 && !n2) {
      this._basicCornerRounded({ x: a5, y: t3, size: o3, context: s2, rotation: -Math.PI / 2 });
      return;
    }
    if (!i && !d3) {
      this._basicCornerRounded({ x: a5, y: t3, size: o3, context: s2, rotation: Math.PI / 2 });
      return;
    }
    this._basicSquare({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
  }
  _drawClassyRounded({ x: a5, y: t3, size: o3, context: s2, getNeighbor: r3 }) {
    const c3 = r3 ? +r3(-1, 0) : 0, i = r3 ? +r3(1, 0) : 0, n2 = r3 ? +r3(0, -1) : 0, d3 = r3 ? +r3(0, 1) : 0;
    if (c3 + i + n2 + d3 === 0) {
      this._basicCornersRounded({ x: a5, y: t3, size: o3, context: s2, rotation: Math.PI / 2 });
      return;
    }
    if (!c3 && !n2) {
      this._basicCornerExtraRounded({ x: a5, y: t3, size: o3, context: s2, rotation: -Math.PI / 2 });
      return;
    }
    if (!i && !d3) {
      this._basicCornerExtraRounded({ x: a5, y: t3, size: o3, context: s2, rotation: Math.PI / 2 });
      return;
    }
    this._basicSquare({ x: a5, y: t3, size: o3, context: s2, rotation: 0 });
  }
};

// node_modules/custom-qr-code/dist/esm/core/tools/calculateImageSize.js
function M({
  originalHeight: r3,
  originalWidth: u7,
  maxHiddenDots: c3,
  maxHiddenAxisDots: h2,
  dotSize: e5
}) {
  const y2 = { x: 0, y: 0 }, t3 = { x: 0, y: 0 };
  if (r3 <= 0 || u7 <= 0 || c3 <= 0 || e5 <= 0)
    return {
      height: 0,
      width: 0,
      hideYDots: 0,
      hideXDots: 0
    };
  const f3 = r3 / u7;
  return y2.x = Math.floor(Math.sqrt(c3 / f3)), y2.x <= 0 && (y2.x = 1), h2 && h2 < y2.x && (y2.x = h2), y2.x % 2 === 0 && y2.x--, t3.x = y2.x * e5, y2.y = 1 + 2 * Math.ceil((y2.x * f3 - 1) / 2), t3.y = Math.round(t3.x * f3), (y2.y * y2.x > c3 || h2 && h2 < y2.y) && (h2 && h2 < y2.y ? (y2.y = h2, y2.y % 2 === 0 && y2.x--) : y2.y -= 2, t3.y = y2.y * e5, y2.x = 1 + 2 * Math.ceil((y2.y / f3 - 1) / 2), t3.x = Math.round(t3.y / f3)), {
    height: t3.y,
    width: t3.x,
    hideYDots: y2.x,
    hideXDots: y2.y
  };
}

// node_modules/custom-qr-code/dist/esm/core/QRCanvas.js
var E = Object.defineProperty;
var L = (y2, i, o3) => i in y2 ? E(y2, i, { enumerable: true, configurable: true, writable: true, value: o3 }) : y2[i] = o3;
var D = (y2, i, o3) => L(y2, typeof i != "symbol" ? i + "" : i, o3);
var M2 = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1]
];
var S = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];
var Z = class {
  //TODO don't pass all options to this class
  constructor(i) {
    D(this, "_canvas");
    D(this, "_options");
    D(this, "_qr");
    D(this, "_image");
    this._canvas = document.createElement("canvas"), this._canvas.width = i.width, this._canvas.height = i.height, this._options = i;
  }
  get context() {
    return this._canvas.getContext("2d");
  }
  get width() {
    return this._canvas.width;
  }
  get height() {
    return this._canvas.height;
  }
  getCanvas() {
    return this._canvas;
  }
  clear() {
    const i = this.context;
    i && i.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
  async drawQR(i) {
    const o3 = i.getModuleCount(), n2 = Math.min(this._options.width, this._options.height) - this._options.margin * 2, e5 = Math.floor(n2 / o3);
    let d3 = {
      hideXDots: 0,
      hideYDots: 0,
      width: 0,
      height: 0
    };
    if (this._qr = i, this._options.image) {
      if (await this.loadImage(), !this._image) return;
      const { imageOptions: t3, qrOptions: r3 } = this._options, h2 = t3.imageSize * r[r3.errorCorrectionLevel], g2 = Math.floor(h2 * o3 * o3);
      d3 = M({
        originalWidth: this._image.width,
        originalHeight: this._image.height,
        maxHiddenDots: g2,
        maxHiddenAxisDots: o3 - 14,
        dotSize: e5
      });
    }
    this.clear(), this.drawBackground(), this.drawDots((t3, r3) => {
      var h2, g2, s2, a5, c3, l4;
      return !(this._options.imageOptions.hideBackgroundDots && t3 >= (o3 - d3.hideXDots) / 2 && t3 < (o3 + d3.hideXDots) / 2 && r3 >= (o3 - d3.hideYDots) / 2 && r3 < (o3 + d3.hideYDots) / 2 || (h2 = M2[t3]) != null && h2[r3] || (g2 = M2[t3 - o3 + 7]) != null && g2[r3] || (s2 = M2[t3]) != null && s2[r3 - o3 + 7] || (a5 = S[t3]) != null && a5[r3] || (c3 = S[t3 - o3 + 7]) != null && c3[r3] || (l4 = S[t3]) != null && l4[r3 - o3 + 7]);
    }), this.drawCorners(), this._options.image && this.drawImage({ width: d3.width, height: d3.height, count: o3, dotSize: e5 });
  }
  drawBackground() {
    const i = this.context, o3 = this._options;
    if (i) {
      if (o3.backgroundOptions.gradient) {
        const n2 = o3.backgroundOptions.gradient, e5 = this._createGradient({
          context: i,
          options: n2,
          additionalRotation: 0,
          x: 0,
          y: 0,
          size: this._canvas.width > this._canvas.height ? this._canvas.width : this._canvas.height
        });
        n2.colorStops.forEach(({ offset: d3, color: t3 }) => {
          e5.addColorStop(d3, t3);
        }), i.fillStyle = e5;
      } else o3.backgroundOptions.color && (i.fillStyle = o3.backgroundOptions.color);
      i.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }
  drawDots(i) {
    if (!this._qr)
      throw "QR code is not defined";
    const o3 = this.context;
    if (!o3)
      throw "QR code is not defined";
    const n2 = this._options, e5 = this._qr.getModuleCount();
    if (e5 > n2.width || e5 > n2.height)
      throw "The canvas is too small.";
    const d3 = Math.min(n2.width, n2.height) - n2.margin * 2, t3 = Math.floor(d3 / e5), r3 = Math.floor((n2.width - e5 * t3) / 2), h2 = Math.floor((n2.height - e5 * t3) / 2), g2 = new b({ context: o3, type: n2.dotsOptions.type });
    o3.beginPath();
    for (let s2 = 0; s2 < e5; s2++)
      for (let a5 = 0; a5 < e5; a5++) {
        if (i && !i(s2, a5) || !this._qr.isDark(s2, a5))
          continue;
        const c3 = this._options.useLegacyDotRotation ? r3 + s2 * t3 : h2 + a5 * t3, l4 = this._options.useLegacyDotRotation ? h2 + a5 * t3 : r3 + s2 * t3;
        g2.draw(
          c3,
          l4,
          t3,
          //Get neighbor function
          (f3, m2) => this._options.useLegacyDotRotation ? s2 + f3 < 0 || a5 + m2 < 0 || s2 + f3 >= e5 || a5 + m2 >= e5 || i && !i(s2 + f3, a5 + m2) ? false : !!this._qr && this._qr.isDark(s2 + f3, a5 + m2) : a5 + f3 < 0 || s2 + m2 < 0 || a5 + f3 >= e5 || s2 + m2 >= e5 || i && !i(a5 + f3, s2 + m2) ? false : !!this._qr && this._qr.isDark(s2 + m2, a5 + f3)
        );
      }
    if (n2.dotsOptions.gradient) {
      const s2 = n2.dotsOptions.gradient, a5 = this._createGradient({
        context: o3,
        options: s2,
        additionalRotation: 0,
        x: r3,
        y: h2,
        size: e5 * t3
      });
      s2.colorStops.forEach(({ offset: c3, color: l4 }) => {
        a5.addColorStop(c3, l4);
      }), o3.fillStyle = o3.strokeStyle = a5;
    } else n2.dotsOptions.color && (o3.fillStyle = o3.strokeStyle = n2.dotsOptions.color);
    o3.fill("evenodd");
  }
  drawCorners(i) {
    if (!this._qr)
      throw "QR code is not defined";
    const o3 = this.context;
    if (!o3)
      throw "QR code is not defined";
    const n2 = this._options, e5 = this._qr.getModuleCount(), d3 = Math.min(n2.width, n2.height) - n2.margin * 2, t3 = Math.floor(d3 / e5), r3 = t3 * 7, h2 = t3 * 3, g2 = Math.floor((n2.width - e5 * t3) / 2), s2 = Math.floor((n2.height - e5 * t3) / 2);
    [
      [0, 0, 0],
      [1, 0, Math.PI / 2],
      [0, 1, -Math.PI / 2]
    ].forEach(([a5, c3, l4]) => {
      var I2, C, q3, P2, R, k, b3, B, Q2, G;
      if (i && !i(a5, c3))
        return;
      const f3 = g2 + a5 * t3 * (e5 - 7), m2 = s2 + c3 * t3 * (e5 - 7);
      if ((I2 = n2.cornersSquareOptions) != null && I2.type) {
        const _4 = new I({ context: o3, type: (C = n2.cornersSquareOptions) == null ? void 0 : C.type });
        o3.beginPath(), _4.draw(f3, m2, r3, l4);
      } else {
        const _4 = new b({ context: o3, type: n2.dotsOptions.type });
        o3.beginPath();
        for (let p2 = 0; p2 < M2.length; p2++)
          for (let u7 = 0; u7 < M2[p2].length; u7++)
            (q3 = M2[p2]) != null && q3[u7] && _4.draw(
              f3 + p2 * t3,
              m2 + u7 * t3,
              t3,
              (w5, x) => {
                var v;
                return !!((v = M2[p2 + w5]) != null && v[u7 + x]);
              }
            );
      }
      if ((P2 = n2.cornersSquareOptions) != null && P2.gradient) {
        const _4 = n2.cornersSquareOptions.gradient, p2 = this._createGradient({
          context: o3,
          options: _4,
          additionalRotation: l4,
          x: f3,
          y: m2,
          size: r3
        });
        _4.colorStops.forEach(({ offset: u7, color: w5 }) => {
          p2.addColorStop(u7, w5);
        }), o3.fillStyle = o3.strokeStyle = p2;
      } else (R = n2.cornersSquareOptions) != null && R.color && (o3.fillStyle = o3.strokeStyle = n2.cornersSquareOptions.color);
      if (o3.fill("evenodd"), (k = n2.cornersDotOptions) != null && k.type) {
        const _4 = new p({ context: o3, type: (b3 = n2.cornersDotOptions) == null ? void 0 : b3.type });
        o3.beginPath(), _4.draw(f3 + t3 * 2, m2 + t3 * 2, h2, l4);
      } else {
        const _4 = new b({ context: o3, type: n2.dotsOptions.type });
        o3.beginPath();
        for (let p2 = 0; p2 < S.length; p2++)
          for (let u7 = 0; u7 < S[p2].length; u7++)
            (B = S[p2]) != null && B[u7] && _4.draw(
              f3 + p2 * t3,
              m2 + u7 * t3,
              t3,
              (w5, x) => {
                var v;
                return !!((v = S[p2 + w5]) != null && v[u7 + x]);
              }
            );
      }
      if ((Q2 = n2.cornersDotOptions) != null && Q2.gradient) {
        const _4 = n2.cornersDotOptions.gradient, p2 = this._createGradient({
          context: o3,
          options: _4,
          additionalRotation: l4,
          x: f3 + t3 * 2,
          y: m2 + t3 * 2,
          size: h2
        });
        _4.colorStops.forEach(({ offset: u7, color: w5 }) => {
          p2.addColorStop(u7, w5);
        }), o3.fillStyle = o3.strokeStyle = p2;
      } else (G = n2.cornersDotOptions) != null && G.color && (o3.fillStyle = o3.strokeStyle = n2.cornersDotOptions.color);
      o3.fill("evenodd");
    });
  }
  loadImage() {
    return new Promise((i, o3) => {
      const n2 = this._options, e5 = new Image();
      if (!n2.image)
        return o3("Image is not defined");
      typeof n2.imageOptions.crossOrigin == "string" && (e5.crossOrigin = n2.imageOptions.crossOrigin), this._image = e5, e5.onload = () => {
        i();
      }, e5.src = n2.image;
    });
  }
  drawImage({
    width: i,
    height: o3,
    count: n2,
    dotSize: e5
  }) {
    const d3 = this.context;
    if (!d3)
      throw "canvasContext is not defined";
    if (!this._image)
      throw "image is not defined";
    const t3 = this._options, r3 = Math.floor((t3.width - n2 * e5) / 2), h2 = Math.floor((t3.height - n2 * e5) / 2), g2 = r3 + t3.imageOptions.margin + (n2 * e5 - i) / 2, s2 = h2 + t3.imageOptions.margin + (n2 * e5 - o3) / 2, a5 = i - t3.imageOptions.margin * 2, c3 = o3 - t3.imageOptions.margin * 2;
    d3.drawImage(this._image, g2, s2, a5 < 0 ? 0 : a5, c3 < 0 ? 0 : c3);
  }
  _createGradient({
    context: i,
    options: o3,
    additionalRotation: n2,
    x: e5,
    y: d3,
    size: t3
  }) {
    let r3;
    if (o3.type === a.radial)
      r3 = i.createRadialGradient(e5 + t3 / 2, d3 + t3 / 2, 0, e5 + t3 / 2, d3 + t3 / 2, t3 / 2);
    else {
      const h2 = ((o3.rotation || 0) + n2) % (2 * Math.PI), g2 = (h2 + 2 * Math.PI) % (2 * Math.PI);
      let s2 = e5 + t3 / 2, a5 = d3 + t3 / 2, c3 = e5 + t3 / 2, l4 = d3 + t3 / 2;
      g2 >= 0 && g2 <= 0.25 * Math.PI || g2 > 1.75 * Math.PI && g2 <= 2 * Math.PI ? (s2 = s2 - t3 / 2, a5 = a5 - t3 / 2 * Math.tan(h2), c3 = c3 + t3 / 2, l4 = l4 + t3 / 2 * Math.tan(h2)) : g2 > 0.25 * Math.PI && g2 <= 0.75 * Math.PI ? (a5 = a5 - t3 / 2, s2 = s2 - t3 / 2 / Math.tan(h2), l4 = l4 + t3 / 2, c3 = c3 + t3 / 2 / Math.tan(h2)) : g2 > 0.75 * Math.PI && g2 <= 1.25 * Math.PI ? (s2 = s2 + t3 / 2, a5 = a5 + t3 / 2 * Math.tan(h2), c3 = c3 - t3 / 2, l4 = l4 - t3 / 2 * Math.tan(h2)) : g2 > 1.25 * Math.PI && g2 <= 1.75 * Math.PI && (a5 = a5 + t3 / 2, s2 = s2 + t3 / 2 / Math.tan(h2), l4 = l4 - t3 / 2, c3 = c3 - t3 / 2 / Math.tan(h2)), r3 = i.createLinearGradient(Math.round(s2), Math.round(a5), Math.round(c3), Math.round(l4));
    }
    return r3;
  }
};

// node_modules/custom-qr-code/dist/esm/core/constants/drawTypes.js
var a2 = {
  canvas: "canvas",
  svg: "svg"
};

// node_modules/custom-qr-code/dist/esm/core/constants/errorCorrectionLevels.js
var e3 = {
  L: "L",
  M: "M",
  Q: "Q",
  H: "H"
};

// node_modules/custom-qr-code/dist/esm/core/constants/qrTypes.js
var t = {};
for (let e5 = 0; e5 <= 40; e5++)
  t[e5] = e5;

// node_modules/custom-qr-code/dist/esm/core/QROptions.js
var s = {
  type: a2.canvas,
  width: 300,
  height: 300,
  data: "",
  margin: 0,
  qrOptions: {
    typeNumber: t[0],
    mode: void 0,
    errorCorrectionLevel: e3.Q
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    crossOrigin: "anonymous",
    margin: 0
  },
  dotsOptions: {
    type: "square",
    color: "#000"
  },
  backgroundOptions: {
    color: "#fff"
  },
  useLegacyDotRotation: false
};

// node_modules/custom-qr-code/dist/esm/core/figures/cornerDot/svg/QRCornerDot.js
var u3 = Object.defineProperty;
var l2 = (i, t3, e5) => t3 in i ? u3(i, t3, { enumerable: true, configurable: true, writable: true, value: e5 }) : i[t3] = e5;
var a3 = (i, t3, e5) => l2(i, typeof t3 != "symbol" ? t3 + "" : t3, e5);
var g = class {
  constructor({ svg: t3, type: e5 }) {
    a3(this, "_element");
    a3(this, "_svg");
    a3(this, "_type");
    this._svg = t3, this._type = e5;
  }
  draw(t3, e5, r3, s2) {
    const c3 = this._type;
    let n2;
    switch (c3) {
      case e.square:
        n2 = this._drawSquare;
        break;
      case e.dot:
      default:
        n2 = this._drawDot;
    }
    n2.call(this, { x: t3, y: e5, size: r3, rotation: s2 });
  }
  _rotateFigure({ x: t3, y: e5, size: r3, rotation: s2 = 0, draw: c3 }) {
    var o3;
    const n2 = t3 + r3 / 2, _4 = e5 + r3 / 2;
    c3(), (o3 = this._element) == null || o3.setAttribute("transform", `rotate(${180 * s2 / Math.PI},${n2},${_4})`);
  }
  _basicDot(t3) {
    const { size: e5, x: r3, y: s2 } = t3;
    this._rotateFigure({
      ...t3,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "circle"), this._element.setAttribute("cx", String(r3 + e5 / 2)), this._element.setAttribute("cy", String(s2 + e5 / 2)), this._element.setAttribute("r", String(e5 / 2));
      }
    });
  }
  _basicSquare(t3) {
    const { size: e5, x: r3, y: s2 } = t3;
    this._rotateFigure({
      ...t3,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "rect"), this._element.setAttribute("x", String(r3)), this._element.setAttribute("y", String(s2)), this._element.setAttribute("width", String(e5)), this._element.setAttribute("height", String(e5));
      }
    });
  }
  _drawDot({ x: t3, y: e5, size: r3, rotation: s2 }) {
    this._basicDot({ x: t3, y: e5, size: r3, rotation: s2 });
  }
  _drawSquare({ x: t3, y: e5, size: r3, rotation: s2 }) {
    this._basicSquare({ x: t3, y: e5, size: r3, rotation: s2 });
  }
};

// node_modules/custom-qr-code/dist/esm/core/figures/cornerSquare/svg/QRCornerSquare.js
var c = Object.defineProperty;
var u4 = (r3, $, e5) => $ in r3 ? c(r3, $, { enumerable: true, configurable: true, writable: true, value: e5 }) : r3[$] = e5;
var o = (r3, $, e5) => u4(r3, typeof $ != "symbol" ? $ + "" : $, e5);
var w = class {
  constructor({ svg: $, type: e5 }) {
    o(this, "_element");
    o(this, "_svg");
    o(this, "_type");
    this._svg = $, this._type = e5;
  }
  draw($, e5, s2, a5) {
    const t3 = this._type;
    let i;
    switch (t3) {
      case e2.square:
        i = this._drawSquare;
        break;
      case e2.extraRounded:
        i = this._drawExtraRounded;
        break;
      case e2.dot:
      default:
        i = this._drawDot;
    }
    i.call(this, { x: $, y: e5, size: s2, rotation: a5 });
  }
  _rotateFigure({ x: $, y: e5, size: s2, rotation: a5 = 0, draw: t3 }) {
    var d3;
    const i = $ + s2 / 2, h2 = e5 + s2 / 2;
    t3(), (d3 = this._element) == null || d3.setAttribute("transform", `rotate(${180 * a5 / Math.PI},${i},${h2})`);
  }
  _basicDot($) {
    const { size: e5, x: s2, y: a5 } = $, t3 = e5 / 7;
    this._rotateFigure({
      ...$,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._element.setAttribute("clip-rule", "evenodd"), this._element.setAttribute(
          "d",
          `M ${s2 + e5 / 2} ${a5}a ${e5 / 2} ${e5 / 2} 0 1 0 0.1 0zm 0 ${t3}a ${e5 / 2 - t3} ${e5 / 2 - t3} 0 1 1 -0.1 0Z`
          // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
        );
      }
    });
  }
  _basicSquare($) {
    const { size: e5, x: s2, y: a5 } = $, t3 = e5 / 7;
    this._rotateFigure({
      ...$,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._element.setAttribute("clip-rule", "evenodd"), this._element.setAttribute(
          "d",
          `M ${s2} ${a5}v ${e5}h ${e5}v ${-e5}zM ${s2 + t3} ${a5 + t3}h ${e5 - 2 * t3}v ${e5 - 2 * t3}h ${-e5 + 2 * t3}z`
        );
      }
    });
  }
  _basicExtraRounded($) {
    const { size: e5, x: s2, y: a5 } = $, t3 = e5 / 7;
    this._rotateFigure({
      ...$,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._element.setAttribute("clip-rule", "evenodd"), this._element.setAttribute(
          "d",
          `M ${s2} ${a5 + 2.5 * t3}v ${2 * t3}a ${2.5 * t3} ${2.5 * t3}, 0, 0, 0, ${t3 * 2.5} ${t3 * 2.5}h ${2 * t3}a ${2.5 * t3} ${2.5 * t3}, 0, 0, 0, ${t3 * 2.5} ${-t3 * 2.5}v ${-2 * t3}a ${2.5 * t3} ${2.5 * t3}, 0, 0, 0, ${-t3 * 2.5} ${-t3 * 2.5}h ${-2 * t3}a ${2.5 * t3} ${2.5 * t3}, 0, 0, 0, ${-t3 * 2.5} ${t3 * 2.5}M ${s2 + 2.5 * t3} ${a5 + t3}h ${2 * t3}a ${1.5 * t3} ${1.5 * t3}, 0, 0, 1, ${t3 * 1.5} ${t3 * 1.5}v ${2 * t3}a ${1.5 * t3} ${1.5 * t3}, 0, 0, 1, ${-t3 * 1.5} ${t3 * 1.5}h ${-2 * t3}a ${1.5 * t3} ${1.5 * t3}, 0, 0, 1, ${-t3 * 1.5} ${-t3 * 1.5}v ${-2 * t3}a ${1.5 * t3} ${1.5 * t3}, 0, 0, 1, ${t3 * 1.5} ${-t3 * 1.5}`
        );
      }
    });
  }
  _drawDot({ x: $, y: e5, size: s2, rotation: a5 }) {
    this._basicDot({ x: $, y: e5, size: s2, rotation: a5 });
  }
  _drawSquare({ x: $, y: e5, size: s2, rotation: a5 }) {
    this._basicSquare({ x: $, y: e5, size: s2, rotation: a5 });
  }
  _drawExtraRounded({ x: $, y: e5, size: s2, rotation: a5 }) {
    this._basicExtraRounded({ x: $, y: e5, size: s2, rotation: a5 });
  }
};

// node_modules/custom-qr-code/dist/esm/core/figures/dot/svg/QRDot.js
var l3 = Object.defineProperty;
var w2 = (d3, e5, t3) => e5 in d3 ? l3(d3, e5, { enumerable: true, configurable: true, writable: true, value: t3 }) : d3[e5] = t3;
var _3 = (d3, e5, t3) => w2(d3, typeof e5 != "symbol" ? e5 + "" : e5, t3);
var m = class {
  constructor({ svg: e5, type: t3 }) {
    _3(this, "_element");
    _3(this, "_svg");
    _3(this, "_type");
    this._svg = e5, this._type = t3;
  }
  draw(e5, t3, s2, r3) {
    const h2 = this._type;
    let n2;
    switch (h2) {
      case d2.dots:
        n2 = this._drawDot;
        break;
      case d2.classy:
        n2 = this._drawClassy;
        break;
      case d2.classyRounded:
        n2 = this._drawClassyRounded;
        break;
      case d2.rounded:
        n2 = this._drawRounded;
        break;
      case d2.extraRounded:
        n2 = this._drawExtraRounded;
        break;
      case d2.square:
      default:
        n2 = this._drawSquare;
    }
    n2.call(this, { x: e5, y: t3, size: s2, getNeighbor: r3 });
  }
  _rotateFigure({ x: e5, y: t3, size: s2, rotation: r3 = 0, draw: h2 }) {
    var a5;
    const n2 = e5 + s2 / 2, o3 = t3 + s2 / 2;
    h2(), (a5 = this._element) == null || a5.setAttribute("transform", `rotate(${180 * r3 / Math.PI},${n2},${o3})`);
  }
  _basicDot(e5) {
    const { size: t3, x: s2, y: r3 } = e5;
    this._rotateFigure({
      ...e5,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "circle"), this._element.setAttribute("cx", String(s2 + t3 / 2)), this._element.setAttribute("cy", String(r3 + t3 / 2)), this._element.setAttribute("r", String(t3 / 2));
      }
    });
  }
  _basicSquare(e5) {
    const { size: t3, x: s2, y: r3 } = e5;
    this._rotateFigure({
      ...e5,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "rect"), this._element.setAttribute("x", String(s2)), this._element.setAttribute("y", String(r3)), this._element.setAttribute("width", String(t3)), this._element.setAttribute("height", String(t3));
      }
    });
  }
  //if rotation === 0 - right side is rounded
  _basicSideRounded(e5) {
    const { size: t3, x: s2, y: r3 } = e5;
    this._rotateFigure({
      ...e5,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._element.setAttribute(
          "d",
          `M ${s2} ${r3}v ${t3}h ${t3 / 2}a ${t3 / 2} ${t3 / 2}, 0, 0, 0, 0 ${-t3}`
          // draw rounded corner
        );
      }
    });
  }
  //if rotation === 0 - top right corner is rounded
  _basicCornerRounded(e5) {
    const { size: t3, x: s2, y: r3 } = e5;
    this._rotateFigure({
      ...e5,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._element.setAttribute(
          "d",
          `M ${s2} ${r3}v ${t3}h ${t3}v ${-t3 / 2}a ${t3 / 2} ${t3 / 2}, 0, 0, 0, ${-t3 / 2} ${-t3 / 2}`
          // draw rounded corner
        );
      }
    });
  }
  //if rotation === 0 - top right corner is rounded
  _basicCornerExtraRounded(e5) {
    const { size: t3, x: s2, y: r3 } = e5;
    this._rotateFigure({
      ...e5,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._element.setAttribute(
          "d",
          `M ${s2} ${r3}v ${t3}h ${t3}a ${t3} ${t3}, 0, 0, 0, ${-t3} ${-t3}`
          // draw rounded top right corner
        );
      }
    });
  }
  //if rotation === 0 - left bottom and right top corners are rounded
  _basicCornersRounded(e5) {
    const { size: t3, x: s2, y: r3 } = e5;
    this._rotateFigure({
      ...e5,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._element.setAttribute(
          "d",
          `M ${s2} ${r3}v ${t3 / 2}a ${t3 / 2} ${t3 / 2}, 0, 0, 0, ${t3 / 2} ${t3 / 2}h ${t3 / 2}v ${-t3 / 2}a ${t3 / 2} ${t3 / 2}, 0, 0, 0, ${-t3 / 2} ${-t3 / 2}`
          // draw rounded right top corner
        );
      }
    });
  }
  _drawDot({ x: e5, y: t3, size: s2 }) {
    this._basicDot({ x: e5, y: t3, size: s2, rotation: 0 });
  }
  _drawSquare({ x: e5, y: t3, size: s2 }) {
    this._basicSquare({ x: e5, y: t3, size: s2, rotation: 0 });
  }
  _drawRounded({ x: e5, y: t3, size: s2, getNeighbor: r3 }) {
    const h2 = r3 ? +r3(-1, 0) : 0, n2 = r3 ? +r3(1, 0) : 0, o3 = r3 ? +r3(0, -1) : 0, a5 = r3 ? +r3(0, 1) : 0, c3 = h2 + n2 + o3 + a5;
    if (c3 === 0) {
      this._basicDot({ x: e5, y: t3, size: s2, rotation: 0 });
      return;
    }
    if (c3 > 2 || h2 && n2 || o3 && a5) {
      this._basicSquare({ x: e5, y: t3, size: s2, rotation: 0 });
      return;
    }
    if (c3 === 2) {
      let i = 0;
      h2 && o3 ? i = Math.PI / 2 : o3 && n2 ? i = Math.PI : n2 && a5 && (i = -Math.PI / 2), this._basicCornerRounded({ x: e5, y: t3, size: s2, rotation: i });
      return;
    }
    if (c3 === 1) {
      let i = 0;
      o3 ? i = Math.PI / 2 : n2 ? i = Math.PI : a5 && (i = -Math.PI / 2), this._basicSideRounded({ x: e5, y: t3, size: s2, rotation: i });
      return;
    }
  }
  _drawExtraRounded({ x: e5, y: t3, size: s2, getNeighbor: r3 }) {
    const h2 = r3 ? +r3(-1, 0) : 0, n2 = r3 ? +r3(1, 0) : 0, o3 = r3 ? +r3(0, -1) : 0, a5 = r3 ? +r3(0, 1) : 0, c3 = h2 + n2 + o3 + a5;
    if (c3 === 0) {
      this._basicDot({ x: e5, y: t3, size: s2, rotation: 0 });
      return;
    }
    if (c3 > 2 || h2 && n2 || o3 && a5) {
      this._basicSquare({ x: e5, y: t3, size: s2, rotation: 0 });
      return;
    }
    if (c3 === 2) {
      let i = 0;
      h2 && o3 ? i = Math.PI / 2 : o3 && n2 ? i = Math.PI : n2 && a5 && (i = -Math.PI / 2), this._basicCornerExtraRounded({ x: e5, y: t3, size: s2, rotation: i });
      return;
    }
    if (c3 === 1) {
      let i = 0;
      o3 ? i = Math.PI / 2 : n2 ? i = Math.PI : a5 && (i = -Math.PI / 2), this._basicSideRounded({ x: e5, y: t3, size: s2, rotation: i });
      return;
    }
  }
  _drawClassy({ x: e5, y: t3, size: s2, getNeighbor: r3 }) {
    const h2 = r3 ? +r3(-1, 0) : 0, n2 = r3 ? +r3(1, 0) : 0, o3 = r3 ? +r3(0, -1) : 0, a5 = r3 ? +r3(0, 1) : 0;
    if (h2 + n2 + o3 + a5 === 0) {
      this._basicCornersRounded({ x: e5, y: t3, size: s2, rotation: Math.PI / 2 });
      return;
    }
    if (!h2 && !o3) {
      this._basicCornerRounded({ x: e5, y: t3, size: s2, rotation: -Math.PI / 2 });
      return;
    }
    if (!n2 && !a5) {
      this._basicCornerRounded({ x: e5, y: t3, size: s2, rotation: Math.PI / 2 });
      return;
    }
    this._basicSquare({ x: e5, y: t3, size: s2, rotation: 0 });
  }
  _drawClassyRounded({ x: e5, y: t3, size: s2, getNeighbor: r3 }) {
    const h2 = r3 ? +r3(-1, 0) : 0, n2 = r3 ? +r3(1, 0) : 0, o3 = r3 ? +r3(0, -1) : 0, a5 = r3 ? +r3(0, 1) : 0;
    if (h2 + n2 + o3 + a5 === 0) {
      this._basicCornersRounded({ x: e5, y: t3, size: s2, rotation: Math.PI / 2 });
      return;
    }
    if (!h2 && !o3) {
      this._basicCornerExtraRounded({ x: e5, y: t3, size: s2, rotation: -Math.PI / 2 });
      return;
    }
    if (!n2 && !a5) {
      this._basicCornerExtraRounded({ x: e5, y: t3, size: s2, rotation: Math.PI / 2 });
      return;
    }
    this._basicSquare({ x: e5, y: t3, size: s2, rotation: 0 });
  }
};

// node_modules/custom-qr-code/dist/esm/core/QRSVG.js
var Q = Object.defineProperty;
var X = (D2, i, t3) => i in D2 ? Q(D2, i, { enumerable: true, configurable: true, writable: true, value: t3 }) : D2[i] = t3;
var w3 = (D2, i, t3) => X(D2, typeof i != "symbol" ? i + "" : i, t3);
var b2 = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1]
];
var M3 = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];
var q = class q2 {
  //TODO don't pass all options to this class
  constructor(i) {
    w3(this, "_id");
    w3(this, "_element");
    w3(this, "_style");
    w3(this, "_defs");
    w3(this, "_dotsClipPath");
    w3(this, "_cornersSquareClipPath");
    w3(this, "_cornersDotClipPath");
    w3(this, "_dots");
    w3(this, "_cornerSquares");
    w3(this, "_corners");
    w3(this, "_cornerDots");
    w3(this, "_options");
    w3(this, "_qr");
    w3(this, "_image");
    this._id = q2._id++, this._element = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this._element.setAttribute("width", String(i.width)), this._element.setAttribute("height", String(i.height)), this._element.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), this._element.setAttribute("data-internal-uid", this.id), this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"), this._style = document.createElementNS("http://www.w3.org/2000/svg", "style"), this._options = i;
  }
  get width() {
    return this._options.width;
  }
  get height() {
    return this._options.height;
  }
  get id() {
    return `svg_qr_${this._id}`;
  }
  getElement() {
    return this._element;
  }
  clear() {
    var t3;
    const i = this._element;
    this._element = i.cloneNode(false), (t3 = i == null ? void 0 : i.parentNode) == null || t3.replaceChild(this._element, i), this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"), this._style = document.createElementNS("http://www.w3.org/2000/svg", "style"), this._element.appendChild(this._style), this._element.appendChild(this._defs);
  }
  async drawQR(i) {
    const t3 = i.getModuleCount(), s2 = Math.min(this._options.width, this._options.height) - this._options.margin * 2, l4 = Math.floor(s2 / t3);
    let e5 = {
      hideXDots: 0,
      hideYDots: 0,
      width: 0,
      height: 0
    };
    if (this._qr = i, this._options.image) {
      if (await this.loadImage(), !this._image) return;
      const { imageOptions: r3, qrOptions: a5 } = this._options, m2 = r3.imageSize * r[a5.errorCorrectionLevel], f3 = Math.floor(m2 * t3 * t3);
      e5 = M({
        originalWidth: this._image.width,
        originalHeight: this._image.height,
        maxHiddenDots: f3,
        maxHiddenAxisDots: t3 - 14,
        dotSize: l4
      });
    }
    this._element.appendChild(this._style), this._element.appendChild(this._defs), this.clear(), this.drawBackground(), this.drawDots((r3, a5) => {
      var m2, f3, c3, h2, o3, n2;
      return !(this._options.imageOptions.hideBackgroundDots && r3 >= (t3 - e5.hideXDots) / 2 && r3 < (t3 + e5.hideXDots) / 2 && a5 >= (t3 - e5.hideYDots) / 2 && a5 < (t3 + e5.hideYDots) / 2 || (m2 = b2[r3]) != null && m2[a5] || (f3 = b2[r3 - t3 + 7]) != null && f3[a5] || (c3 = b2[r3]) != null && c3[a5 - t3 + 7] || (h2 = M3[r3]) != null && h2[a5] || (o3 = M3[r3 - t3 + 7]) != null && o3[a5] || (n2 = M3[r3]) != null && n2[a5 - t3 + 7]);
    }), this.drawCorners(), this._options.image && await this.drawImage({ width: e5.width, height: e5.height, count: t3, dotSize: l4 });
  }
  drawBackground() {
    var s2, l4, e5;
    const i = this._element, t3 = this._options;
    if (i) {
      const r3 = (s2 = t3.backgroundOptions) == null ? void 0 : s2.gradient, a5 = (l4 = t3.backgroundOptions) == null ? void 0 : l4.color;
      r3 ? this._createColor({
        options: r3,
        color: a5,
        additionalRotation: 0,
        x: 0,
        y: 0,
        height: t3.height,
        width: t3.width,
        name: "background-color"
      }) : (e5 = t3.backgroundOptions) != null && e5.color && this._createStyle({
        color: a5,
        name: "background-color"
      });
    }
  }
  drawDots(i) {
    var f3, c3, h2;
    if (!this._qr)
      throw "QR code is not defined";
    const t3 = this._options, s2 = this._qr.getModuleCount();
    if (s2 > t3.width || s2 > t3.height)
      throw "The canvas is too small.";
    const l4 = Math.min(t3.width, t3.height) - t3.margin * 2, e5 = Math.floor(l4 / s2), r3 = Math.floor((t3.width - s2 * e5) / 2), a5 = Math.floor((t3.height - s2 * e5) / 2), m2 = new m({ svg: this._element, type: t3.dotsOptions.type });
    (f3 = t3.dotsOptions) != null && f3.gradient ? (this._dotsClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath"), this._dotsClipPath.setAttribute("id", "clip-path-dot-color"), this._defs.appendChild(this._dotsClipPath), this._createColor({
      options: (c3 = t3.dotsOptions) == null ? void 0 : c3.gradient,
      color: t3.dotsOptions.color,
      additionalRotation: 0,
      x: r3,
      y: a5,
      height: s2 * e5,
      width: s2 * e5,
      name: "dot-color"
    })) : t3.dotsOptions.color && (this._dots = document.createElementNS("http://www.w3.org/2000/svg", "g"), this._dots.setAttribute("class", "dot-color"), this._element.appendChild(this._dots), this._createStyle({
      color: t3.dotsOptions.color,
      name: "dot-color"
    }));
    for (let o3 = 0; o3 < s2; o3++)
      for (let n2 = 0; n2 < s2; n2++) {
        if (i && !i(o3, n2) || !((h2 = this._qr) != null && h2.isDark(o3, n2)))
          continue;
        const g2 = this._options.useLegacyDotRotation ? r3 + o3 * e5 : a5 + n2 * e5, u7 = this._options.useLegacyDotRotation ? a5 + n2 * e5 : r3 + o3 * e5;
        m2.draw(g2, u7, e5, (d3, _4) => this._options.useLegacyDotRotation ? o3 + d3 < 0 || n2 + _4 < 0 || o3 + d3 >= s2 || n2 + _4 >= s2 || i && !i(o3 + d3, n2 + _4) ? false : !!this._qr && this._qr.isDark(o3 + d3, n2 + _4) : n2 + d3 < 0 || o3 + _4 < 0 || n2 + d3 >= s2 || o3 + _4 >= s2 || i && !i(n2 + d3, o3 + _4) ? false : !!this._qr && this._qr.isDark(o3 + _4, n2 + d3)), m2._element && this._dotsClipPath ? this._dotsClipPath.appendChild(m2._element) : m2._element && this._dots && this._dots.appendChild(m2._element);
      }
  }
  drawCorners() {
    if (!this._qr)
      throw "QR code is not defined";
    const i = this._element, t3 = this._options;
    if (!i)
      throw "Element code is not defined";
    const s2 = this._qr.getModuleCount(), l4 = Math.min(t3.width, t3.height) - t3.margin * 2, e5 = Math.floor(l4 / s2), r3 = e5 * 7, a5 = e5 * 3, m2 = Math.floor((t3.width - s2 * e5) / 2), f3 = Math.floor((t3.height - s2 * e5) / 2);
    [
      [0, 0, 0],
      [1, 0, Math.PI / 2],
      [0, 1, -Math.PI / 2]
    ].forEach(([c3, h2, o3]) => {
      var _4, I2, O, $, E2, N, k, x, B, R, z, L2, U, T;
      const n2 = m2 + c3 * e5 * (s2 - 7), g2 = f3 + h2 * e5 * (s2 - 7);
      let u7 = this._dotsClipPath, d3 = this._dotsClipPath;
      if ((_4 = t3.cornersSquareOptions) != null && _4.gradient ? (u7 = document.createElementNS("http://www.w3.org/2000/svg", "clipPath"), u7.setAttribute("id", `clip-path-corners-square-color-${c3}-${h2}`), this._defs.appendChild(u7), this._cornersSquareClipPath = this._cornersDotClipPath = d3 = u7, this._createColor({
        options: (I2 = t3.cornersSquareOptions) == null ? void 0 : I2.gradient,
        color: (O = t3.cornersSquareOptions) == null ? void 0 : O.color,
        additionalRotation: o3,
        x: n2,
        y: g2,
        height: r3,
        width: r3,
        name: `corners-square-color-${c3}-${h2}`
      })) : (this._cornerSquares = document.createElementNS("http://www.w3.org/2000/svg", "g"), this._cornerSquares.setAttribute("class", `corners-square-color-${c3}-${h2}`), this._element.appendChild(this._cornerSquares), this._createStyle({
        color: ($ = t3.cornersSquareOptions) == null ? void 0 : $.color,
        name: `corners-square-color-${c3}-${h2}`
      })), (E2 = t3.cornersSquareOptions) != null && E2.type) {
        const p2 = new w({ svg: this._element, type: t3.cornersSquareOptions.type });
        p2.draw(n2, g2, r3, o3), (N = t3.cornersSquareOptions) != null && N.gradient && p2._element && u7 ? u7.appendChild(p2._element) : p2._element && this._cornerSquares && this._cornerSquares.appendChild(p2._element);
      } else {
        const p2 = new m({ svg: this._element, type: t3.dotsOptions.type });
        for (let S2 = 0; S2 < b2.length; S2++)
          for (let C = 0; C < b2[S2].length; C++)
            (k = b2[S2]) != null && k[C] && (p2.draw(
              n2 + S2 * e5,
              g2 + C * e5,
              e5,
              (A, P2) => {
                var y2;
                return !!((y2 = b2[S2 + A]) != null && y2[C + P2]);
              }
            ), p2._element && this._cornersSquareClipPath ? this._cornersSquareClipPath.appendChild(p2._element) : p2._element && this._cornerSquares && this._cornerSquares.appendChild(p2._element));
      }
      if ((x = t3.cornersDotOptions) != null && x.gradient ? (d3 = document.createElementNS("http://www.w3.org/2000/svg", "clipPath"), d3.setAttribute("id", `clip-path-corners-dot-color-${c3}-${h2}`), this._defs.appendChild(d3), this._cornersDotClipPath = d3, this._createColor({
        options: (B = t3.cornersDotOptions) == null ? void 0 : B.gradient,
        color: (R = t3.cornersDotOptions) == null ? void 0 : R.color,
        additionalRotation: o3,
        x: n2 + e5 * 2,
        y: g2 + e5 * 2,
        height: a5,
        width: a5,
        name: `corners-dot-color-${c3}-${h2}`
      })) : (this._cornerDots = document.createElementNS("http://www.w3.org/2000/svg", "g"), this._cornerDots.setAttribute("class", `corners-dot-color-${c3}-${h2}`), this._element.appendChild(this._cornerDots), this._createStyle({
        color: (z = t3.cornersDotOptions) == null ? void 0 : z.color,
        name: `corners-dot-color-${c3}-${h2}`
      })), (L2 = t3.cornersDotOptions) != null && L2.type) {
        const p2 = new g({ svg: this._element, type: t3.cornersDotOptions.type });
        p2.draw(n2 + e5 * 2, g2 + e5 * 2, a5, o3), (U = t3.cornersDotOptions) != null && U.gradient && p2._element && d3 ? d3.appendChild(p2._element) : p2._element && this._cornerDots && this._cornerDots.appendChild(p2._element);
      } else {
        const p2 = new m({ svg: this._element, type: t3.dotsOptions.type });
        for (let S2 = 0; S2 < M3.length; S2++)
          for (let C = 0; C < M3[S2].length; C++)
            (T = M3[S2]) != null && T[C] && (p2.draw(
              n2 + S2 * e5,
              g2 + C * e5,
              e5,
              (A, P2) => {
                var y2;
                return !!((y2 = M3[S2 + A]) != null && y2[C + P2]);
              }
            ), p2._element && this._cornersDotClipPath ? this._cornersDotClipPath.appendChild(p2._element) : p2._element && this._cornerDots && this._cornerDots.appendChild(p2._element));
      }
    });
  }
  loadImage() {
    return new Promise((i, t3) => {
      const s2 = this._options, l4 = new Image();
      if (!s2.image)
        return t3("Image is not defined");
      typeof s2.imageOptions.crossOrigin == "string" && (l4.crossOrigin = s2.imageOptions.crossOrigin), this._image = l4, l4.onload = () => {
        i();
      }, l4.src = s2.image;
    });
  }
  async drawImage({
    width: i,
    height: t3,
    count: s2,
    dotSize: l4
  }) {
    const e5 = this._options, r3 = Math.floor((e5.width - s2 * l4) / 2), a5 = Math.floor((e5.height - s2 * l4) / 2), m2 = r3 + e5.imageOptions.margin + (s2 * l4 - i) / 2, f3 = a5 + e5.imageOptions.margin + (s2 * l4 - t3) / 2, c3 = i - e5.imageOptions.margin * 2, h2 = t3 - e5.imageOptions.margin * 2, o3 = document.createElementNS("http://www.w3.org/2000/svg", "image"), n2 = await this._getBase64Image(e5.image || "");
    o3.setAttribute("href", n2), o3.setAttribute("xlink:href", n2), o3.setAttribute("x", String(m2)), o3.setAttribute("y", String(f3)), o3.setAttribute("width", `${c3}px`), o3.setAttribute("height", `${h2}px`), this._element.appendChild(o3);
  }
  async _getImageBlob(i) {
    return (await fetch(i)).blob();
  }
  // convert a blob to base64
  _blobToBase64(i) {
    return new Promise((t3) => {
      const s2 = new FileReader();
      s2.onload = () => {
        const l4 = s2.result;
        t3(l4);
      }, s2.readAsDataURL(i);
    });
  }
  async _getBase64Image(i) {
    if (i === "")
      return new Promise((l4) => {
        l4("");
      });
    const t3 = await this._getImageBlob(i);
    return await this._blobToBase64(t3);
  }
  _createColor({
    options: i,
    color: t3,
    additionalRotation: s2,
    x: l4,
    y: e5,
    height: r3,
    width: a5,
    name: m2
  }) {
    const f3 = a5 > r3 ? a5 : r3, c3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    if (c3.setAttribute("x", String(l4)), c3.setAttribute("y", String(e5)), c3.setAttribute("height", String(r3)), c3.setAttribute("width", String(a5)), c3.setAttribute("clip-path", `url('#clip-path-${m2}')`), i) {
      let h2;
      if (i.type === a.radial)
        h2 = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient"), h2.setAttribute("id", m2), h2.setAttribute("gradientUnits", "userSpaceOnUse"), h2.setAttribute("fx", String(l4 + a5 / 2)), h2.setAttribute("fy", String(e5 + r3 / 2)), h2.setAttribute("cx", String(l4 + a5 / 2)), h2.setAttribute("cy", String(e5 + r3 / 2)), h2.setAttribute("r", String(f3 / 2));
      else {
        const o3 = ((i.rotation || 0) + s2) % (2 * Math.PI), n2 = (o3 + 2 * Math.PI) % (2 * Math.PI);
        let g2 = l4 + a5 / 2, u7 = e5 + r3 / 2, d3 = l4 + a5 / 2, _4 = e5 + r3 / 2;
        n2 >= 0 && n2 <= 0.25 * Math.PI || n2 > 1.75 * Math.PI && n2 <= 2 * Math.PI ? (g2 = g2 - a5 / 2, u7 = u7 - r3 / 2 * Math.tan(o3), d3 = d3 + a5 / 2, _4 = _4 + r3 / 2 * Math.tan(o3)) : n2 > 0.25 * Math.PI && n2 <= 0.75 * Math.PI ? (u7 = u7 - r3 / 2, g2 = g2 - a5 / 2 / Math.tan(o3), _4 = _4 + r3 / 2, d3 = d3 + a5 / 2 / Math.tan(o3)) : n2 > 0.75 * Math.PI && n2 <= 1.25 * Math.PI ? (g2 = g2 + a5 / 2, u7 = u7 + r3 / 2 * Math.tan(o3), d3 = d3 - a5 / 2, _4 = _4 - r3 / 2 * Math.tan(o3)) : n2 > 1.25 * Math.PI && n2 <= 1.75 * Math.PI && (u7 = u7 + r3 / 2, g2 = g2 + a5 / 2 / Math.tan(o3), _4 = _4 - r3 / 2, d3 = d3 - a5 / 2 / Math.tan(o3)), h2 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"), h2.setAttribute("id", m2), h2.setAttribute("gradientUnits", "userSpaceOnUse"), h2.setAttribute("x1", String(Math.round(g2))), h2.setAttribute("y1", String(Math.round(u7))), h2.setAttribute("x2", String(Math.round(d3))), h2.setAttribute("y2", String(Math.round(_4)));
      }
      i.colorStops.forEach(({ offset: o3, color: n2 }) => {
        const g2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        g2.setAttribute("offset", `${100 * o3}%`), g2.setAttribute("stop-color", n2), h2.appendChild(g2);
      }), c3.setAttribute("fill", `url('#${m2}')`), this._defs.appendChild(h2);
    } else t3 && c3.setAttribute("fill", t3);
    this._element.appendChild(c3);
  }
  _createStyle({ color: i, name: t3 }) {
    this._style.innerHTML += `[data-internal-uid="${this.id}"] .${t3}{ fill: ${i}; }`;
  }
};
w3(q, "_id", 0);
var H = q;

// node_modules/custom-qr-code/dist/esm/core/tools/downloadURI.js
function n(e5, o3) {
  const d3 = document.createElement("a");
  d3.download = o3, d3.href = e5, document.body.appendChild(d3), d3.click(), document.body.removeChild(d3);
}

// node_modules/custom-qr-code/dist/esm/core/constants/modes.js
var e4 = {
  numeric: "Numeric",
  alphanumeric: "Alphanumeric",
  byte: "Byte",
  kanji: "Kanji"
};

// node_modules/custom-qr-code/dist/esm/core/tools/getMode.js
function u5(t3) {
  switch (true) {
    case /^[0-9]*$/.test(t3):
      return e4.numeric;
    case /^[0-9A-Z $%*+\-./:]*$/.test(t3):
      return e4.alphanumeric;
    default:
      return e4.byte;
  }
}

// node_modules/custom-qr-code/dist/esm/core/tools/merge.js
var c2 = (r3) => !!r3 && typeof r3 == "object" && !Array.isArray(r3);
function o2(r3, ...e5) {
  if (!e5.length) return r3;
  const n2 = e5.shift();
  return n2 === void 0 || !c2(r3) || !c2(n2) ? r3 : (r3 = { ...r3 }, Object.keys(n2).forEach((s2) => {
    const f3 = r3[s2], i = n2[s2];
    Array.isArray(f3) && Array.isArray(i) ? r3[s2] = i : c2(f3) && c2(i) ? r3[s2] = o2(Object.assign({}, f3), i) : r3[s2] = i;
  }), o2(r3, ...e5));
}

// node_modules/custom-qr-code/dist/esm/core/tools/sanitizeOptions.js
function t2(o3) {
  const i = { ...o3 };
  if (!i.colorStops || !i.colorStops.length)
    throw "Field 'colorStops' is required in gradient";
  return i.rotation ? i.rotation = Number(i.rotation) : i.rotation = 0, i.colorStops = i.colorStops.map((n2) => ({
    ...n2,
    offset: Number(n2.offset)
  })), i;
}
function r2(o3) {
  const i = { ...o3 };
  return i.width = Number(i.width), i.height = Number(i.height), i.margin = Number(i.margin), i.imageOptions = {
    ...i.imageOptions,
    hideBackgroundDots: !!i.imageOptions.hideBackgroundDots,
    imageSize: Number(i.imageOptions.imageSize),
    margin: Number(i.imageOptions.margin)
  }, i.margin > Math.min(i.width, i.height) && (i.margin = Math.min(i.width, i.height)), i.dotsOptions = {
    ...i.dotsOptions
  }, i.dotsOptions.gradient && (i.dotsOptions.gradient = t2(i.dotsOptions.gradient)), i.cornersSquareOptions && (i.cornersSquareOptions = {
    ...i.cornersSquareOptions
  }, i.cornersSquareOptions.gradient && (i.cornersSquareOptions.gradient = t2(i.cornersSquareOptions.gradient))), i.cornersDotOptions && (i.cornersDotOptions = {
    ...i.cornersDotOptions
  }, i.cornersDotOptions.gradient && (i.cornersDotOptions.gradient = t2(i.cornersDotOptions.gradient))), i.backgroundOptions && (i.backgroundOptions = {
    ...i.backgroundOptions
  }, i.backgroundOptions.gradient && (i.backgroundOptions.gradient = t2(i.backgroundOptions.gradient))), i;
}

// node_modules/custom-qr-code/dist/esm/core/CustomQRCode.js
var f2 = Object.defineProperty;
var u6 = (o3, t3, e5) => t3 in o3 ? f2(o3, t3, { enumerable: true, configurable: true, writable: true, value: e5 }) : o3[t3] = e5;
var a4 = (o3, t3, e5) => u6(o3, typeof t3 != "symbol" ? t3 + "" : t3, e5);
var w4 = class _w {
  constructor(t3) {
    a4(this, "_options");
    a4(this, "_container");
    a4(this, "_canvas");
    a4(this, "_svg");
    a4(this, "_qr");
    a4(this, "_canvasDrawingPromise");
    a4(this, "_svgDrawingPromise");
    this._options = t3 ? r2(o2(s, t3)) : s, this.update();
  }
  static _clearContainer(t3) {
    t3 && (t3.innerHTML = "");
  }
  async _getQRStylingElement(t3) {
    if (!this._qr) throw "QR code is empty";
    if (t3.toLowerCase() === "svg") {
      let n2, s2;
      return this._svg && this._svgDrawingPromise ? (s2 = this._svg, n2 = this._svgDrawingPromise) : (s2 = new H(this._options), n2 = s2.drawQR(this._qr)), await n2, s2;
    }
    let e5, i;
    return this._canvas && this._canvasDrawingPromise ? (i = this._canvas, e5 = this._canvasDrawingPromise) : (i = new Z(this._options), e5 = i.drawQR(this._qr)), await e5, i;
  }
  update(t3) {
    _w._clearContainer(this._container), this._options = t3 ? r2(o2(this._options, t3)) : this._options, this._options.data && (this._qr = (0, import_qrcode_generator.default)(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel), this._qr.addData(this._options.data, this._options.qrOptions.mode || u5(this._options.data)), this._qr.make(), this._options.type === a2.canvas ? (this._canvas = new Z(this._options), this._canvasDrawingPromise = this._canvas.drawQR(this._qr), this._svgDrawingPromise = void 0, this._svg = void 0) : (this._svg = new H(this._options), this._svgDrawingPromise = this._svg.drawQR(this._qr), this._canvasDrawingPromise = void 0, this._canvas = void 0), this.append(this._container));
  }
  append(t3) {
    if (t3) {
      if (typeof t3.appendChild != "function")
        throw "Container should be a single DOM node";
      this._options.type === a2.canvas ? this._canvas && t3.appendChild(this._canvas.getCanvas()) : this._svg && t3.appendChild(this._svg.getElement()), this._container = t3;
    }
  }
  async getRawData(t3 = "png", e5) {
    if (!this._qr) throw "QR code is empty";
    const i = t3.toLocaleLowerCase();
    if (i === "svg") {
      const s2 = await this._getQRStylingElement(i), r3 = new XMLSerializer().serializeToString(s2.getElement());
      return new Blob([`<?xml version="1.0" standalone="no"?>\r
${r3}`], { type: "image/svg+xml" });
    }
    const n2 = await this._getQRStylingElement(i);
    return new Promise((s2) => n2.getCanvas().toBlob(s2, `image/${i}`, e5));
  }
  /**
   *
   * @param extension file format of the returned image
   * @param quality [0-1] with 1 being the highest quality
   * @returns
   */
  async toDataUrl(t3 = "png", e5) {
    if (!this._qr) throw "QR code is empty";
    const i = t3.toLocaleLowerCase();
    return (await this._getQRStylingElement(i)).getCanvas().toDataURL(`image/${i}`, e5);
  }
  async download(t3) {
    if (!this._qr) throw "QR code is empty";
    let e5 = "png", i = "qr";
    typeof t3 == "object" && t3 !== null && (t3.name && (i = t3.name), t3.extension && (e5 = t3.extension));
    const n2 = e5.toLocaleLowerCase();
    if (n2 === "svg") {
      const s2 = await this._getQRStylingElement(n2);
      let r3 = new XMLSerializer().serializeToString(s2.getElement());
      r3 = `<?xml version="1.0" standalone="no"?>\r
${r3}`;
      const d3 = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(r3)}`;
      n(d3, `${i}.svg`);
    } else {
      const h2 = (await this._getQRStylingElement(n2)).getCanvas().toDataURL(`image/${e5}`);
      n(h2, `${i}.${e5}`);
    }
  }
};

// vendor-entry.js
var import_qrcode_generator2 = __toESM(require_qrcode(), 1);
var export_qrcodegen = import_qrcode_generator2.default;
export {
  w4 as CustomQRCode,
  export_qrcodegen as qrcodegen
};
