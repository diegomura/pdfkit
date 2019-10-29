'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stream = _interopDefault(require('stream'));
var zlib = _interopDefault(require('zlib'));
var fontkit = _interopDefault(require('@react-pdf/fontkit'));
var LZString = _interopDefault(require('lz-string'));
var fs = _interopDefault(require('fs'));
var PNG = _interopDefault(require('@react-pdf/png-js'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var PDFReference = function (_stream$Writable) {
  inherits(PDFReference, _stream$Writable);

  function PDFReference(document, id, data) {
    classCallCheck(this, PDFReference);

    var _this = possibleConstructorReturn(this, (PDFReference.__proto__ || Object.getPrototypeOf(PDFReference)).call(this, { decodeStrings: false }));

    _this.finalize = _this.finalize.bind(_this);
    _this.document = document;
    _this.id = id;
    if (data == null) {
      data = {};
    }
    _this.data = data;

    _this.gen = 0;
    _this.deflate = null;
    _this.compress = _this.document.compress && !_this.data.Filter;
    _this.uncompressedLength = 0;
    _this.chunks = [];
    return _this;
  }

  createClass(PDFReference, [{
    key: 'initDeflate',
    value: function initDeflate() {
      var _this2 = this;

      this.data.Filter = 'FlateDecode';

      this.deflate = zlib.createDeflate();
      this.deflate.on('data', function (chunk) {
        _this2.chunks.push(chunk);
        return _this2.data.Length += chunk.length;
      });

      return this.deflate.on('end', this.finalize);
    }
  }, {
    key: '_write',
    value: function _write(chunk, encoding, callback) {
      if (!Buffer.isBuffer(chunk)) {
        chunk = new Buffer(chunk + '\n', 'binary');
      }

      this.uncompressedLength += chunk.length;
      if (this.data.Length == null) {
        this.data.Length = 0;
      }

      if (this.compress) {
        if (!this.deflate) {
          this.initDeflate();
        }
        this.deflate.write(chunk);
      } else {
        this.chunks.push(chunk);
        this.data.Length += chunk.length;
      }

      return callback();
    }
  }, {
    key: 'end',
    value: function end(chunk) {
      get(PDFReference.prototype.__proto__ || Object.getPrototypeOf(PDFReference.prototype), 'end', this).apply(this, arguments);

      if (this.deflate) {
        return this.deflate.end();
      } else {
        return this.finalize();
      }
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      this.offset = this.document._offset;

      this.document._write(this.id + ' ' + this.gen + ' obj');
      this.document._write(PDFObject.convert(this.data));

      if (this.chunks.length) {
        this.document._write('stream');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(this.chunks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var chunk = _step.value;

            this.document._write(chunk);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.chunks.length = 0; // free up memory
        this.document._write('\nendstream');
      }

      this.document._write('endobj');
      return this.document._refEnd(this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + ' ' + this.gen + ' R';
    }
  }]);
  return PDFReference;
}(stream.Writable);

/*
PDFNameTree - represents a name tree object
*/

var PDFNameTree$1 = function () {
    function PDFNameTree() {
        classCallCheck(this, PDFNameTree);

        this._items = {};
    }

    createClass(PDFNameTree, [{
        key: 'add',
        value: function add(key, val) {
            return this._items[key] = val;
        }
    }, {
        key: 'get',
        value: function get$$1(key) {
            return this._items[key];
        }
    }, {
        key: 'toString',
        value: function toString() {
            // Needs to be sorted by key
            var sortedKeys = Object.keys(this._items).sort(function (a, b) {
                return a.localeCompare(b);
            });

            var out = ['<<'];
            if (sortedKeys.length > 1) {
                var first = sortedKeys[0],
                    last = sortedKeys[sortedKeys.length - 1];
                out.push('  /Limits ' + PDFObject.convert([new String(first), new String(last)]));
            }
            out.push('  /Names [');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = sortedKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    out.push('    ' + PDFObject.convert(new String(key)) + ' ' + PDFObject.convert(this._items[key]));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            out.push(']');
            out.push('>>');
            return out.join('\n');
        }
    }]);
    return PDFNameTree;
}();

var escapableRe = /[\n\r\t\b\f\(\)\\]/g;
var escapable = {
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\b': '\\b',
  '\f': '\\f',
  '\\': '\\\\',
  '(': '\\(',
  ')': '\\)'
};

var pad = function pad(str, length) {
  return (Array(length + 1).join('0') + str).slice(-length);
};

// Convert little endian UTF-16 to big endian
var swapBytes = function swapBytes(buff) {
  var l = buff.length;
  if (l & 0x01) {
    throw new Error('Buffer length must be even');
  } else {
    for (var i = 0, end = l - 1; i < end; i += 2) {
      var a = buff[i];
      buff[i] = buff[i + 1];
      buff[i + 1] = a;
    }
  }

  return buff;
};

var PDFObject = function () {
  function PDFObject() {
    classCallCheck(this, PDFObject);
  }

  createClass(PDFObject, null, [{
    key: 'convert',
    value: function convert(object) {
      // String literals are converted to the PDF name type
      if (typeof object === 'string') {
        return '/' + object;

        // String objects are converted to PDF strings (UTF-16)
      } else if (object instanceof String) {
        var string = object;
        // Detect if this is a unicode string
        var isUnicode = false;
        for (var i = 0, end = string.length; i < end; i++) {
          if (string.charCodeAt(i) > 0x7f) {
            isUnicode = true;
            break;
          }
        }

        // If so, encode it as big endian UTF-16
        if (isUnicode) {
          string = swapBytes(new Buffer('\uFEFF' + string, 'utf16le')).toString('binary');
        }

        // Escape characters as required by the spec
        string = string.replace(escapableRe, function (c) {
          return escapable[c];
        });

        return '(' + string + ')';

        // Buffers are converted to PDF hex strings
      } else if (Buffer.isBuffer(object)) {
        return '<' + object.toString('hex') + '>';
      } else if (object instanceof PDFReference || object instanceof PDFNameTree$1) {
        return object.toString();
      } else if (object instanceof Date) {
        return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth() + 1, 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
      } else if (Array.isArray(object)) {
        var items = Array.from(object).map(function (e) {
          return PDFObject.convert(e);
        }).join(' ');
        return '[' + items + ']';
      } else if ({}.toString.call(object) === '[object Object]') {
        var out = ['<<'];
        for (var key in object) {
          var val = object[key];
          out.push('/' + key + ' ' + PDFObject.convert(val));
        }

        out.push('>>');
        return out.join('\n');
      } else if (typeof object === 'number') {
        return PDFObject.number(object);
      } else {
        return '' + object;
      }
    }
  }, {
    key: 'number',
    value: function number(n) {
      if (n > -1e21 && n < 1e21) {
        return Math.round(n * 1e6) / 1e6;
      }

      throw new Error('unsupported number: ' + n);
    }
  }]);
  return PDFObject;
}();

var SIZES = {
  '4A0': [4767.87, 6740.79],
  '2A0': [3370.39, 4767.87],
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  A7: [209.76, 297.64],
  A8: [147.4, 209.76],
  A9: [104.88, 147.4],
  A10: [73.7, 104.88],
  B0: [2834.65, 4008.19],
  B1: [2004.09, 2834.65],
  B2: [1417.32, 2004.09],
  B3: [1000.63, 1417.32],
  B4: [708.66, 1000.63],
  B5: [498.9, 708.66],
  B6: [354.33, 498.9],
  B7: [249.45, 354.33],
  B8: [175.75, 249.45],
  B9: [124.72, 175.75],
  B10: [87.87, 124.72],
  C0: [2599.37, 3676.54],
  C1: [1836.85, 2599.37],
  C2: [1298.27, 1836.85],
  C3: [918.43, 1298.27],
  C4: [649.13, 918.43],
  C5: [459.21, 649.13],
  C6: [323.15, 459.21],
  C7: [229.61, 323.15],
  C8: [161.57, 229.61],
  C9: [113.39, 161.57],
  C10: [79.37, 113.39],
  RA0: [2437.8, 3458.27],
  RA1: [1729.13, 2437.8],
  RA2: [1218.9, 1729.13],
  RA3: [864.57, 1218.9],
  RA4: [609.45, 864.57],
  SRA0: [2551.18, 3628.35],
  SRA1: [1814.17, 2551.18],
  SRA2: [1275.59, 1814.17],
  SRA3: [907.09, 1275.59],
  SRA4: [637.8, 907.09],
  EXECUTIVE: [521.86, 756.0],
  FOLIO: [612.0, 936.0],
  LEGAL: [612.0, 1008.0],
  LETTER: [612.0, 792.0],
  TABLOID: [792.0, 1224.0]
};

var PDFPage = function () {
  function PDFPage(document, options) {
    var _this = this;

    classCallCheck(this, PDFPage);

    this.document = document;
    if (options == null) {
      options = {};
    }
    this.size = options.size || 'letter';
    this.layout = options.layout || 'portrait';

    // calculate page dimensions
    var dimensions = Array.isArray(this.size) ? this.size : SIZES[this.size.toUpperCase()];
    this.width = dimensions[this.layout === 'portrait' ? 0 : 1];
    this.height = dimensions[this.layout === 'portrait' ? 1 : 0];

    this.content = this.document.ref();

    // Initialize the Font, XObject, and ExtGState dictionaries
    this.resources = this.document.ref({
      ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI']
    });

    // Lazily create these dictionaries
    Object.defineProperties(this, {
      fonts: {
        get: function get$$1() {
          return _this.resources.data.Font != null ? _this.resources.data.Font : _this.resources.data.Font = {};
        }
      },
      xobjects: {
        get: function get$$1() {
          return _this.resources.data.XObject != null ? _this.resources.data.XObject : _this.resources.data.XObject = {};
        }
      },
      ext_gstates: {
        get: function get$$1() {
          return _this.resources.data.ExtGState != null ? _this.resources.data.ExtGState : _this.resources.data.ExtGState = {};
        }
      },
      patterns: {
        get: function get$$1() {
          return _this.resources.data.Pattern != null ? _this.resources.data.Pattern : _this.resources.data.Pattern = {};
        }
      },
      annotations: {
        get: function get$$1() {
          return _this.dictionary.data.Annots != null ? _this.dictionary.data.Annots : _this.dictionary.data.Annots = [];
        }
      }
    });

    // The page dictionary
    this.dictionary = this.document.ref({
      Type: 'Page',
      Parent: this.document._root.data.Pages,
      MediaBox: [0, 0, this.width, this.height],
      Contents: this.content,
      Resources: this.resources
    });
  }

  createClass(PDFPage, [{
    key: 'maxY',
    value: function maxY() {
      return this.height;
    }
  }, {
    key: 'write',
    value: function write(chunk) {
      return this.content.write(chunk);
    }
  }, {
    key: 'end',
    value: function end() {
      this.dictionary.end();
      this.resources.end();
      return this.content.end();
    }
  }]);
  return PDFPage;
}();

var Color = {
  initColor: function initColor() {
    // The opacity dictionaries
    this._opacityRegistry = {};
    this._opacityCount = 0;
    return this._gradCount = 0;
  },
  _normalizeColor: function _normalizeColor(color) {
    var part = void 0;
    if (typeof color === 'string') {
      if (color.charAt(0) === '#') {
        if (color.length === 4) {
          color = color.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i, '#$1$1$2$2$3$3');
        }
        var hex = parseInt(color.slice(1), 16);
        color = [hex >> 16, hex >> 8 & 0xff, hex & 0xff];
      } else if (namedColors[color]) {
        color = namedColors[color];
      }
    }

    if (Array.isArray(color)) {
      // RGB
      if (color.length === 3) {
        color = function () {
          var result = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Array.from(color)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              part = _step.value;

              result.push(part / 255);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return result;
        }();

        // CMYK
      } else if (color.length === 4) {
        color = function () {
          var result1 = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Array.from(color)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              part = _step2.value;

              result1.push(part / 100);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return result1;
        }();
      }

      return color;
    }

    return null;
  },
  _setColor: function _setColor(color, stroke) {
    color = this._normalizeColor(color);
    if (!color) {
      return false;
    }

    var op = stroke ? 'SCN' : 'scn';

    var space = color.length === 4 ? 'DeviceCMYK' : 'DeviceRGB';
    this._setColorSpace(space, stroke);

    color = color.join(' ');
    this.addContent(color + ' ' + op);

    return true;
  },
  _setColorSpace: function _setColorSpace(space, stroke) {
    var op = stroke ? 'CS' : 'cs';
    return this.addContent('/' + space + ' ' + op);
  },
  fillColor: function fillColor(color, opacity) {
    var set$$1 = this._setColor(color, false);
    if (set$$1) {
      this.fillOpacity(opacity);
    }

    // save this for text wrapper, which needs to reset
    // the fill color on new pages
    this._fillColor = [color, opacity];
    return this;
  },
  strokeColor: function strokeColor(color, opacity) {
    var set$$1 = this._setColor(color, true);
    if (set$$1) {
      this.strokeOpacity(opacity);
    }
    return this;
  },
  opacity: function opacity(_opacity) {
    this._doOpacity(_opacity, _opacity);
    return this;
  },
  fillOpacity: function fillOpacity(opacity) {
    this._doOpacity(opacity, null);
    return this;
  },
  strokeOpacity: function strokeOpacity(opacity) {
    this._doOpacity(null, opacity);
    return this;
  },
  _doOpacity: function _doOpacity(fillOpacity, strokeOpacity) {
    var dictionary = void 0,
        name = void 0;
    if (fillOpacity == null && strokeOpacity == null) {
      return;
    }

    if (fillOpacity != null) {
      fillOpacity = Math.max(0, Math.min(1, fillOpacity));
    }
    if (strokeOpacity != null) {
      strokeOpacity = Math.max(0, Math.min(1, strokeOpacity));
    }
    var key = fillOpacity + '_' + strokeOpacity;

    if (this._opacityRegistry[key]) {
      var _Array$from = Array.from(this._opacityRegistry[key]);

      var _Array$from2 = slicedToArray(_Array$from, 2);

      dictionary = _Array$from2[0];
      name = _Array$from2[1];
    } else {
      dictionary = { Type: 'ExtGState' };

      if (fillOpacity != null) {
        dictionary.ca = fillOpacity;
      }
      if (strokeOpacity != null) {
        dictionary.CA = strokeOpacity;
      }

      dictionary = this.ref(dictionary);
      dictionary.end();
      var id = ++this._opacityCount;
      name = 'Gs' + id;
      this._opacityRegistry[key] = [dictionary, name];
    }

    this.page.ext_gstates[name] = dictionary;
    return this.addContent('/' + name + ' gs');
  }
};

var namedColors = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};

var SVGPath = function () {
  var parameters = undefined;
  var parse = undefined;
  var cx = undefined;
  var _apply = undefined;
  var runners = undefined;
  var solveArc = undefined;
  var arcToSegments = undefined;
  var segmentToBezier = undefined;
  SVGPath = function () {
    function SVGPath() {
      classCallCheck(this, SVGPath);
    }

    createClass(SVGPath, null, [{
      key: 'initClass',
      value: function initClass() {
        var cy = void 0,
            px = void 0,
            py = void 0,
            sx = void 0,
            sy = void 0;
        parameters = {
          A: 7,
          a: 7,
          C: 6,
          c: 6,
          H: 1,
          h: 1,
          L: 2,
          l: 2,
          M: 2,
          m: 2,
          Q: 4,
          q: 4,
          S: 4,
          s: 4,
          T: 2,
          t: 2,
          V: 1,
          v: 1,
          Z: 0,
          z: 0
        };

        parse = function parse(path) {
          var cmd = void 0;
          var ret = [];
          var args = [];
          var curArg = '';
          var foundDecimal = false;
          var params = 0;

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Array.from(path)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var c = _step.value;

              if (parameters[c] != null) {
                params = parameters[c];
                if (cmd) {
                  // save existing command
                  if (curArg.length > 0) {
                    args[args.length] = +curArg;
                  }
                  ret[ret.length] = { cmd: cmd, args: args };

                  args = [];
                  curArg = '';
                  foundDecimal = false;
                }

                cmd = c;
              } else if ([' ', ','].includes(c) || c === '-' && curArg.length > 0 && curArg[curArg.length - 1] !== 'e' || c === '.' && foundDecimal) {
                if (curArg.length === 0) {
                  continue;
                }

                if (args.length === params) {
                  // handle reused commands
                  ret[ret.length] = { cmd: cmd, args: args };
                  args = [+curArg];

                  // handle assumed commands
                  if (cmd === 'M') {
                    cmd = 'L';
                  }
                  if (cmd === 'm') {
                    cmd = 'l';
                  }
                } else {
                  args[args.length] = +curArg;
                }

                foundDecimal = c === '.';

                // fix for negative numbers or repeated decimals with no delimeter between commands
                curArg = ['-', '.'].includes(c) ? c : '';
              } else {
                curArg += c;
                if (c === '.') {
                  foundDecimal = true;
                }
              }
            }

            // add the last command
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (curArg.length > 0) {
            if (args.length === params) {
              // handle reused commands
              ret[ret.length] = { cmd: cmd, args: args };
              args = [+curArg];

              // handle assumed commands
              if (cmd === 'M') {
                cmd = 'L';
              }
              if (cmd === 'm') {
                cmd = 'l';
              }
            } else {
              args[args.length] = +curArg;
            }
          }

          ret[ret.length] = { cmd: cmd, args: args };

          return ret;
        };

        cx = cy = px = py = sx = sy = 0;
        _apply = function _apply(commands, doc) {
          // current point, control point, and subpath starting point
          cx = cy = px = py = sx = sy = 0;

          // run the commands
          for (var i = 0; i < commands.length; i++) {
            var c = commands[i];
            if (typeof runners[c.cmd] === 'function') {
              runners[c.cmd](doc, c.args);
            }
          }

          return cx = cy = px = py = 0;
        };

        runners = {
          M: function M(doc, a) {
            cx = a[0];
            cy = a[1];
            px = py = null;
            sx = cx;
            sy = cy;
            return doc.moveTo(cx, cy);
          },
          m: function m(doc, a) {
            cx += a[0];
            cy += a[1];
            px = py = null;
            sx = cx;
            sy = cy;
            return doc.moveTo(cx, cy);
          },
          C: function C(doc, a) {
            cx = a[4];
            cy = a[5];
            px = a[2];
            py = a[3];
            return doc.bezierCurveTo.apply(doc, toConsumableArray(Array.from(a || [])));
          },
          c: function c(doc, a) {
            doc.bezierCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy, a[4] + cx, a[5] + cy);
            px = cx + a[2];
            py = cy + a[3];
            cx += a[4];
            return cy += a[5];
          },
          S: function S(doc, a) {
            if (px === null) {
              px = cx;
              py = cy;
            }

            doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
            px = a[0];
            py = a[1];
            cx = a[2];
            return cy = a[3];
          },
          s: function s(doc, a) {
            if (px === null) {
              px = cx;
              py = cy;
            }

            doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
            px = cx + a[0];
            py = cy + a[1];
            cx += a[2];
            return cy += a[3];
          },
          Q: function Q(doc, a) {
            px = a[0];
            py = a[1];
            cx = a[2];
            cy = a[3];
            return doc.quadraticCurveTo(a[0], a[1], cx, cy);
          },
          q: function q(doc, a) {
            doc.quadraticCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy);
            px = cx + a[0];
            py = cy + a[1];
            cx += a[2];
            return cy += a[3];
          },
          T: function T(doc, a) {
            if (px === null) {
              px = cx;
              py = cy;
            } else {
              px = cx - (px - cx);
              py = cy - (py - cy);
            }

            doc.quadraticCurveTo(px, py, a[0], a[1]);
            px = cx - (px - cx);
            py = cy - (py - cy);
            cx = a[0];
            return cy = a[1];
          },
          t: function t(doc, a) {
            if (px === null) {
              px = cx;
              py = cy;
            } else {
              px = cx - (px - cx);
              py = cy - (py - cy);
            }

            doc.quadraticCurveTo(px, py, cx + a[0], cy + a[1]);
            cx += a[0];
            return cy += a[1];
          },
          A: function A(doc, a) {
            solveArc(doc, cx, cy, a);
            cx = a[5];
            return cy = a[6];
          },
          a: function a(doc, _a) {
            _a[5] += cx;
            _a[6] += cy;
            solveArc(doc, cx, cy, _a);
            cx = _a[5];
            return cy = _a[6];
          },
          L: function L(doc, a) {
            cx = a[0];
            cy = a[1];
            px = py = null;
            return doc.lineTo(cx, cy);
          },
          l: function l(doc, a) {
            cx += a[0];
            cy += a[1];
            px = py = null;
            return doc.lineTo(cx, cy);
          },
          H: function H(doc, a) {
            cx = a[0];
            px = py = null;
            return doc.lineTo(cx, cy);
          },
          h: function h(doc, a) {
            cx += a[0];
            px = py = null;
            return doc.lineTo(cx, cy);
          },
          V: function V(doc, a) {
            cy = a[0];
            px = py = null;
            return doc.lineTo(cx, cy);
          },
          v: function v(doc, a) {
            cy += a[0];
            px = py = null;
            return doc.lineTo(cx, cy);
          },
          Z: function Z(doc) {
            doc.closePath();
            cx = sx;
            return cy = sy;
          },
          z: function z(doc) {
            doc.closePath();
            cx = sx;
            return cy = sy;
          }
        };

        solveArc = function solveArc(doc, x, y, coords) {
          var _Array$from = Array.from(coords),
              _Array$from2 = slicedToArray(_Array$from, 7),
              rx = _Array$from2[0],
              ry = _Array$from2[1],
              rot = _Array$from2[2],
              large = _Array$from2[3],
              sweep = _Array$from2[4],
              ex = _Array$from2[5],
              ey = _Array$from2[6];

          var segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);

          return function () {
            var result = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = Array.from(segs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var seg = _step2.value;

                var bez = segmentToBezier.apply(undefined, toConsumableArray(Array.from(seg || [])));
                result.push(doc.bezierCurveTo.apply(doc, toConsumableArray(Array.from(bez || []))));
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return result;
          }();
        };

        // from Inkscape svgtopdf, thanks!
        arcToSegments = function arcToSegments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
          var th = rotateX * (Math.PI / 180);
          var sin_th = Math.sin(th);
          var cos_th = Math.cos(th);
          rx = Math.abs(rx);
          ry = Math.abs(ry);
          px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
          py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
          var pl = px * px / (rx * rx) + py * py / (ry * ry);
          if (pl > 1) {
            pl = Math.sqrt(pl);
            rx *= pl;
            ry *= pl;
          }

          var a00 = cos_th / rx;
          var a01 = sin_th / rx;
          var a10 = -sin_th / ry;
          var a11 = cos_th / ry;
          var x0 = a00 * ox + a01 * oy;
          var y0 = a10 * ox + a11 * oy;
          var x1 = a00 * x + a01 * y;
          var y1 = a10 * x + a11 * y;

          var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
          var sfactor_sq = 1 / d - 0.25;
          if (sfactor_sq < 0) {
            sfactor_sq = 0;
          }
          var sfactor = Math.sqrt(sfactor_sq);
          if (sweep === large) {
            sfactor = -sfactor;
          }

          var xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
          var yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);

          var th0 = Math.atan2(y0 - yc, x0 - xc);
          var th1 = Math.atan2(y1 - yc, x1 - xc);

          var th_arc = th1 - th0;
          if (th_arc < 0 && sweep === 1) {
            th_arc += 2 * Math.PI;
          } else if (th_arc > 0 && sweep === 0) {
            th_arc -= 2 * Math.PI;
          }

          var segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
          var result = [];

          for (var i = 0, end = segments, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            var th2 = th0 + i * th_arc / segments;
            var th3 = th0 + (i + 1) * th_arc / segments;
            result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
          }

          return result;
        };

        segmentToBezier = function segmentToBezier(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
          var a00 = cos_th * rx;
          var a01 = -sin_th * ry;
          var a10 = sin_th * rx;
          var a11 = cos_th * ry;

          var th_half = 0.5 * (th1 - th0);
          var t = 8 / 3 * Math.sin(th_half * 0.5) * Math.sin(th_half * 0.5) / Math.sin(th_half);
          var x1 = cx + Math.cos(th0) - t * Math.sin(th0);
          var y1 = cy + Math.sin(th0) + t * Math.cos(th0);
          var x3 = cx + Math.cos(th1);
          var y3 = cy + Math.sin(th1);
          var x2 = x3 + t * Math.sin(th1);
          var y2 = y3 - t * Math.cos(th1);

          return [a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3];
        };
      }
    }, {
      key: 'apply',
      value: function apply(doc, path) {
        var commands = parse(path);
        return _apply(commands, doc);
      }
    }]);
    return SVGPath;
  }();
  SVGPath.initClass();
  return SVGPath;
}();

var SVGPath$1 = SVGPath;

// This constant is used to approximate a symmetrical arc using a cubic
// Bezier curve.
var KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

var Vector = {
  initVector: function initVector() {
    this._ctm = [1, 0, 0, 1, 0, 0]; // current transformation matrix
    return this._ctmStack = [];
  },
  save: function save() {
    this._ctmStack.push(this._ctm.slice());
    // TODO: save/restore colorspace and styles so not setting it unnessesarily all the time?
    return this.addContent('q');
  },
  restore: function restore() {
    this._ctm = this._ctmStack.pop() || [1, 0, 0, 1, 0, 0];
    return this.addContent('Q');
  },
  closePath: function closePath() {
    return this.addContent('h');
  },
  lineWidth: function lineWidth(w) {
    return this.addContent(PDFObject.number(w) + ' w');
  },


  _CAP_STYLES: {
    BUTT: 0,
    ROUND: 1,
    SQUARE: 2
  },

  lineCap: function lineCap(c) {
    if (typeof c === 'string') {
      c = this._CAP_STYLES[c.toUpperCase()];
    }
    return this.addContent(c + ' J');
  },


  _JOIN_STYLES: {
    MITER: 0,
    ROUND: 1,
    BEVEL: 2
  },

  lineJoin: function lineJoin(j) {
    if (typeof j === 'string') {
      j = this._JOIN_STYLES[j.toUpperCase()];
    }
    return this.addContent(j + ' j');
  },
  miterLimit: function miterLimit(m) {
    return this.addContent(PDFObject.number(m) + ' M');
  },
  dash: function dash(length, options) {
    var phase = void 0;
    if (options == null) {
      options = {};
    }
    if (length == null) {
      return this;
    }
    if (Array.isArray(length)) {
      length = Array.from(length).map(function (v) {
        return PDFObject.number(v);
      }).join(' ');
      phase = options.phase || 0;
      return this.addContent('[' + length + '] ' + PDFObject.number(phase) + ' d');
    } else {
      var space = options.space != null ? options.space : length;
      phase = options.phase || 0;
      return this.addContent('[' + PDFObject.number(length) + ' ' + PDFObject.number(space) + '] ' + PDFObject.number(phase) + ' d');
    }
  },
  undash: function undash() {
    return this.addContent('[] 0 d');
  },
  moveTo: function moveTo(x, y) {
    return this.addContent(PDFObject.number(x) + ' ' + PDFObject.number(y) + ' m');
  },
  lineTo: function lineTo(x, y) {
    return this.addContent(PDFObject.number(x) + ' ' + PDFObject.number(y) + ' l');
  },
  bezierCurveTo: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    return this.addContent(PDFObject.number(cp1x) + ' ' + PDFObject.number(cp1y) + ' ' + PDFObject.number(cp2x) + ' ' + PDFObject.number(cp2y) + ' ' + PDFObject.number(x) + ' ' + PDFObject.number(y) + ' c');
  },
  quadraticCurveTo: function quadraticCurveTo(cpx, cpy, x, y) {
    return this.addContent(PDFObject.number(cpx) + ' ' + PDFObject.number(cpy) + ' ' + PDFObject.number(x) + ' ' + PDFObject.number(y) + ' v');
  },
  rect: function rect(x, y, w, h) {
    return this.addContent(PDFObject.number(x) + ' ' + PDFObject.number(y) + ' ' + PDFObject.number(w) + ' ' + PDFObject.number(h) + ' re');
  },
  roundedRect: function roundedRect(x, y, w, h, r) {
    if (r == null) {
      r = 0;
    }
    r = Math.min(r, 0.5 * w, 0.5 * h);

    // amount to inset control points from corners (see `ellipse`)
    var c = r * (1.0 - KAPPA);

    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.bezierCurveTo(x + w - c, y, x + w, y + c, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.bezierCurveTo(x + w, y + h - c, x + w - c, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.bezierCurveTo(x + c, y + h, x, y + h - c, x, y + h - r);
    this.lineTo(x, y + r);
    this.bezierCurveTo(x, y + c, x + c, y, x + r, y);
    return this.closePath();
  },
  ellipse: function ellipse(x, y, r1, r2) {
    // based on http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas/2173084#2173084
    if (r2 == null) {
      r2 = r1;
    }
    x -= r1;
    y -= r2;
    var ox = r1 * KAPPA;
    var oy = r2 * KAPPA;
    var xe = x + r1 * 2;
    var ye = y + r2 * 2;
    var xm = x + r1;
    var ym = y + r2;

    this.moveTo(x, ym);
    this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    return this.closePath();
  },
  circle: function circle(x, y, radius) {
    return this.ellipse(x, y, radius);
  },
  arc: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    if (anticlockwise == null) {
      anticlockwise = false;
    }
    var TWO_PI = 2.0 * Math.PI;
    var HALF_PI = 0.5 * Math.PI;

    var deltaAng = endAngle - startAngle;

    if (Math.abs(deltaAng) > TWO_PI) {
      // draw only full circle if more than that is specified
      deltaAng = TWO_PI;
    } else if (deltaAng !== 0 && anticlockwise !== deltaAng < 0) {
      // necessary to flip direction of rendering
      var dir = anticlockwise ? -1 : 1;
      deltaAng = dir * TWO_PI + deltaAng;
    }

    var numSegs = Math.ceil(Math.abs(deltaAng) / HALF_PI);
    var segAng = deltaAng / numSegs;
    var handleLen = segAng / HALF_PI * KAPPA * radius;
    var curAng = startAngle;

    // component distances between anchor point and control point
    var deltaCx = -Math.sin(curAng) * handleLen;
    var deltaCy = Math.cos(curAng) * handleLen;

    // anchor point
    var ax = x + Math.cos(curAng) * radius;
    var ay = y + Math.sin(curAng) * radius;

    // calculate and render segments
    this.moveTo(ax, ay);

    for (var segIdx = 0, end = numSegs, asc = 0 <= end; asc ? segIdx < end : segIdx > end; asc ? segIdx++ : segIdx--) {
      // starting control point
      var cp1x = ax + deltaCx;
      var cp1y = ay + deltaCy;

      // step angle
      curAng += segAng;

      // next anchor point
      ax = x + Math.cos(curAng) * radius;
      ay = y + Math.sin(curAng) * radius;

      // next control point delta
      deltaCx = -Math.sin(curAng) * handleLen;
      deltaCy = Math.cos(curAng) * handleLen;

      // ending control point
      var cp2x = ax - deltaCx;
      var cp2y = ay - deltaCy;

      // render segment
      this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ax, ay);
    }

    return this;
  },
  polygon: function polygon() {
    for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
      points[_key] = arguments[_key];
    }

    this.moveTo.apply(this, toConsumableArray(Array.from(points.shift() || [])));
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Array.from(points)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var point = _step.value;

        this.lineTo.apply(this, toConsumableArray(Array.from(point || [])));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return this.closePath();
  },
  path: function path(_path) {
    SVGPath$1.apply(this, _path);
    return this;
  },
  _windingRule: function _windingRule(rule) {
    if (/even-?odd/.test(rule)) {
      return '*';
    }

    return '';
  },
  fill: function fill(color, rule) {
    if (/(even-?odd)|(non-?zero)/.test(color)) {
      rule = color;
      color = null;
    }

    if (color) {
      this.fillColor(color);
    }
    return this.addContent('f' + this._windingRule(rule));
  },
  stroke: function stroke(color) {
    if (color) {
      this.strokeColor(color);
    }
    return this.addContent('S');
  },
  fillAndStroke: function fillAndStroke(fillColor, strokeColor, rule) {
    if (strokeColor == null) {
      strokeColor = fillColor;
    }
    var isFillRule = /(even-?odd)|(non-?zero)/;
    if (isFillRule.test(fillColor)) {
      rule = fillColor;
      fillColor = null;
    }

    if (isFillRule.test(strokeColor)) {
      rule = strokeColor;
      strokeColor = fillColor;
    }

    if (fillColor) {
      this.fillColor(fillColor);
      this.strokeColor(strokeColor);
    }

    return this.addContent('B' + this._windingRule(rule));
  },
  clip: function clip(rule) {
    return this.addContent('W' + this._windingRule(rule) + ' n');
  },
  transform: function transform(m11, m12, m21, m22, dx, dy) {
    // keep track of the current transformation matrix
    var m = this._ctm;

    var _Array$from = Array.from(m),
        _Array$from2 = slicedToArray(_Array$from, 6),
        m0 = _Array$from2[0],
        m1 = _Array$from2[1],
        m2 = _Array$from2[2],
        m3 = _Array$from2[3],
        m4 = _Array$from2[4],
        m5 = _Array$from2[5];

    m[0] = m0 * m11 + m2 * m12;
    m[1] = m1 * m11 + m3 * m12;
    m[2] = m0 * m21 + m2 * m22;
    m[3] = m1 * m21 + m3 * m22;
    m[4] = m0 * dx + m2 * dy + m4;
    m[5] = m1 * dx + m3 * dy + m5;

    var values = [m11, m12, m21, m22, dx, dy].map(function (v) {
      return PDFObject.number(v);
    }).join(' ');
    return this.addContent(values + ' cm');
  },
  translate: function translate(x, y) {
    return this.transform(1, 0, 0, 1, x, y);
  },
  rotate: function rotate(angle, options) {
    var y = void 0;
    if (options == null) {
      options = {};
    }
    var rad = angle * Math.PI / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var x = y = 0;

    if (options.origin != null) {
      var _Array$from3 = Array.from(options.origin);

      var _Array$from4 = slicedToArray(_Array$from3, 2);

      x = _Array$from4[0];
      y = _Array$from4[1];

      var x1 = x * cos - y * sin;
      var y1 = x * sin + y * cos;
      x -= x1;
      y -= y1;
    }

    return this.transform(cos, sin, -sin, cos, x, y);
  },
  scale: function scale(xFactor, yFactor, options) {
    var y = void 0;
    if (yFactor == null) {
      yFactor = xFactor;
    }
    if (options == null) {
      options = {};
    }
    if ((typeof yFactor === 'undefined' ? 'undefined' : _typeof(yFactor)) === 'object') {
      options = yFactor;
      yFactor = xFactor;
    }

    var x = y = 0;
    if (options.origin != null) {
      var _Array$from5 = Array.from(options.origin);

      var _Array$from6 = slicedToArray(_Array$from5, 2);

      x = _Array$from6[0];
      y = _Array$from6[1];

      x -= xFactor * x;
      y -= yFactor * y;
    }

    return this.transform(xFactor, 0, 0, yFactor, x, y);
  }
};

var range = function range(left, right, inclusive) {
  var range = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;

  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }

  return range;
};

var WIN_ANSI_MAP = {
  402: 131,
  8211: 150,
  8212: 151,
  8216: 145,
  8217: 146,
  8218: 130,
  8220: 147,
  8221: 148,
  8222: 132,
  8224: 134,
  8225: 135,
  8226: 149,
  8230: 133,
  8364: 128,
  8240: 137,
  8249: 139,
  8250: 155,
  710: 136,
  8482: 153,
  338: 140,
  339: 156,
  732: 152,
  352: 138,
  353: 154,
  376: 159,
  381: 142,
  382: 158
};

var characters = '.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n\nspace         exclam         quotedbl       numbersign\ndollar        percent        ampersand      quotesingle\nparenleft     parenright     asterisk       plus\ncomma         hyphen         period         slash\nzero          one            two            three\nfour          five           six            seven\neight         nine           colon          semicolon\nless          equal          greater        question\n\nat            A              B              C\nD             E              F              G\nH             I              J              K\nL             M              N              O\nP             Q              R              S\nT             U              V              W\nX             Y              Z              bracketleft\nbackslash     bracketright   asciicircum    underscore\n\ngrave         a              b              c\nd             e              f              g\nh             i              j              k\nl             m              n              o\np             q              r              s\nt             u              v              w\nx             y              z              braceleft\nbar           braceright     asciitilde     .notdef\n\nEuro          .notdef        quotesinglbase florin\nquotedblbase  ellipsis       dagger         daggerdbl\ncircumflex    perthousand    Scaron         guilsinglleft\nOE            .notdef        Zcaron         .notdef\n.notdef       quoteleft      quoteright     quotedblleft\nquotedblright bullet         endash         emdash\ntilde         trademark      scaron         guilsinglright\noe            .notdef        zcaron         ydieresis\n\nspace         exclamdown     cent           sterling\ncurrency      yen            brokenbar      section\ndieresis      copyright      ordfeminine    guillemotleft\nlogicalnot    hyphen         registered     macron\ndegree        plusminus      twosuperior    threesuperior\nacute         mu             paragraph      periodcentered\ncedilla       onesuperior    ordmasculine   guillemotright\nonequarter    onehalf        threequarters  questiondown\n\nAgrave        Aacute         Acircumflex    Atilde\nAdieresis     Aring          AE             Ccedilla\nEgrave        Eacute         Ecircumflex    Edieresis\nIgrave        Iacute         Icircumflex    Idieresis\nEth           Ntilde         Ograve         Oacute\nOcircumflex   Otilde         Odieresis      multiply\nOslash        Ugrave         Uacute         Ucircumflex\nUdieresis     Yacute         Thorn          germandbls\n\nagrave        aacute         acircumflex    atilde\nadieresis     aring          ae             ccedilla\negrave        eacute         ecircumflex    edieresis\nigrave        iacute         icircumflex    idieresis\neth           ntilde         ograve         oacute\nocircumflex   otilde         odieresis      divide\noslash        ugrave         uacute         ucircumflex\nudieresis     yacute         thorn          ydieresis'.split(/\s+/);

var AFMFont = function () {
  createClass(AFMFont, null, [{
    key: 'open',
    value: function open(filename) {
      return new AFMFont(fs.readFileSync(filename, 'utf8'));
    }
  }]);

  function AFMFont(contents) {
    var _this = this;

    classCallCheck(this, AFMFont);

    this.contents = contents;
    this.attributes = {};
    this.glyphWidths = {};
    this.boundingBoxes = {};
    this.kernPairs = {};

    this.parse();
    this.charWidths = range(0, 255, true).map(function (i) {
      return _this.glyphWidths[characters[i]];
    });
    this.bbox = Array.from(this.attributes['FontBBox'].split(/\s+/)).map(function (e) {
      return +e;
    });
    this.ascender = +(this.attributes['Ascender'] || 0);
    this.descender = +(this.attributes['Descender'] || 0);
    this.xHeight = +(this.attributes['XHeight'] || 0);
    this.capHeight = +(this.attributes['CapHeight'] || 0);
    this.lineGap = this.bbox[3] - this.bbox[1] - (this.ascender - this.descender);
  }

  createClass(AFMFont, [{
    key: 'parse',
    value: function parse() {
      var section = '';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.from(this.contents.split('\n'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          var match;
          var a;
          if (match = line.match(/^Start(\w+)/)) {
            section = match[1];
            continue;
          } else if (match = line.match(/^End(\w+)/)) {
            section = '';
            continue;
          }

          switch (section) {
            case 'FontMetrics':
              match = line.match(/(^\w+)\s+(.*)/);
              var key = match[1];
              var value = match[2];

              if (a = this.attributes[key]) {
                if (!Array.isArray(a)) {
                  a = this.attributes[key] = [a];
                }
                a.push(value);
              } else {
                this.attributes[key] = value;
              }
              break;

            case 'CharMetrics':
              if (!/^CH?\s/.test(line)) {
                continue;
              }
              var name = line.match(/\bN\s+(\.?\w+)\s*;/)[1];
              this.glyphWidths[name] = +line.match(/\bWX\s+(\d+)\s*;/)[1];
              break;

            case 'KernPairs':
              match = line.match(/^KPX\s+(\.?\w+)\s+(\.?\w+)\s+(-?\d+)/);
              if (match) {
                this.kernPairs[match[1] + '\0' + match[2]] = parseInt(match[3]);
              }
              break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'encodeText',
    value: function encodeText(text) {
      var res = [];
      for (var i = 0, end = text.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        var char = text.charCodeAt(i);
        char = WIN_ANSI_MAP[char] || char;
        res.push(char.toString(16));
      }

      return res;
    }
  }, {
    key: 'glyphsForString',
    value: function glyphsForString(string) {
      var glyphs = [];

      for (var i = 0, end = string.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        var charCode = string.charCodeAt(i);
        glyphs.push(this.characterToGlyph(charCode));
      }

      return glyphs;
    }
  }, {
    key: 'characterToGlyph',
    value: function characterToGlyph(character) {
      return characters[WIN_ANSI_MAP[character] || character] || '.notdef';
    }
  }, {
    key: 'widthOfGlyph',
    value: function widthOfGlyph(glyph) {
      return this.glyphWidths[glyph] || 0;
    }
  }, {
    key: 'getKernPair',
    value: function getKernPair(left, right) {
      return this.kernPairs[left + '\0' + right] || 0;
    }
  }, {
    key: 'advancesForGlyphs',
    value: function advancesForGlyphs(glyphs) {
      var advances = [];

      for (var index = 0; index < glyphs.length; index++) {
        var left = glyphs[index];
        var right = glyphs[index + 1];
        advances.push(this.widthOfGlyph(left) + this.getKernPair(left, right));
      }

      return advances;
    }
  }]);
  return AFMFont;
}();

var Courier = "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";

var CourierBold = "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=";

var CourierOblique = "MoFwhgTiBiD2B2ICyBTEECWBjAzgAgBYA6ARgFgAoAYVgFtaVE8aAHAT0wHMALEPACiwBKPCQCcADjEAaUWLEAGWeLEll8gEzqxAZm0B2PAEEAJrABGKPMDY4QKWvgCS8LLAgt3YeyaJ5jADYBeABKGDwg+CEoOCgQAG4ovpQ09Ix8VBAo3hgIeAAi3igAXHgAKtwArnhIYGz+JKL6xTrNAKwacmL6KXQMTACq8BgAjpUoTvmEOgpt5NR96XgAakiVOGCcViQAbBoEEnj6bRIaYpRwiAByYAzMsJWYcQC0APLmAaPjF5VBN3c0R4YOJ4d6fMYoC63DABNj/KyAp4QSgAdRQ4V4NSSGEqtEoTnAnywRngnACVmeJA0+Jw0AwAA8kgAFDAgLDcPDob7UbiQMBYewQYBoPAAUXp9ngJiSIToYHgFwQIAAQsrYPS8M8NIYtW0FHgJAQxAbZnhKENpRBPvAUEzYDhWbl4JqSAoFOapXFrSgKtgANY2nD4PWUZZxB15N06Ihu90UK6wEDYBGwdhcTGCETiKTaJRdNRdLRdPRdQymCxWGx2BzOVzuTwQIq+fxGIKhDGRUIxOKJZIUUV1kwYUnAdkOKzlyygeUmSAmAduIeklJgFgACXRETwbT2lAAGhuO4QNDtKEYcFhGJa8HtzhR8jFL56IC62j0KKATGuUdv5p/lj+cyUNOUBULyECoOg2D4DoJBtCkeA6J0ADceAonuN5ungqFXHgOAsPyViocqeD6mRpHYQhOg6NhaEYTsWE4XgKD0lgAS3LRJH7DRlJtIQOwENu+goVRgmoehmH6kxYyJkkHycXg2o0UhhxtEh257JR1CIXx4n0YxeC4fAuKWBADqcM6xGiNRmrqW0Yg7DeOjGshVGOXpkm0bhZhBJACmuoclIntuDk3pprnaa0tESQxUmGXgLBxE+fBWSQOiCbxIXGnsImRYcHmxV5eC3IlZkzgpEg6nB24SPqbQEDREVUIhLl0Z50mVLJ6YpXgXESMpGiHEafE7rlzUEHFMUGbhBFZPA5IAGY9SRsE8QFQmdDlWnjY0BXTQlkCMN1/lRZSCiHM5jlbU1x7RfpcW4WA1aYDgfoKRoVKKW+NX6gxhg3Q1d3tfFLABOs/lnIQgknPqBD6FJCEEGJbWFUxbj0GA/nfZSn2tPqVJjYQuko/t3BsCw3CMFjnQaLB24nIpEi6Yj7kkw9CVxLkJjvTogXVbznSui5iP/WzRU4OxOAcqln3PLVmGCbe22EPlYtMQAXnEsBYxl1Vvnx12I61U3swgRG9XgkgUXMBsaITepA6j8UgAA7trVnw9bOyHIb2lzI7+0gNwWTmyRpyvtuvM3nbysdAH7MLQ8L6ped1sEI0vvNWp8dFQtGCJAp8gRyc2UKP9CH1TnTEOhqqVtHxmVK5n9NV/FsSJJZFskOHv2fX9sesybRWbpiqXqZlJw+zHN3fXt7PDDahdrSN+iK9PFeq0PaOwAEeRWbTfN8UjjS88zfvG/d4sONgO97132MkJ9x+IUzysMa3uHkkGheOQQm2uoQYSb9dpq3iigMYYBggp2NGlH2WFWjuQQuFUBuFOBZCKMnC2r8/5ZUAYTHYjUUF4AhHYJ070Y4T36htN+yMt7xW8BDKqI1w7Nx2MTOhuEjAKRor9MuGl8GD0vkxEiVlAa90cqNN+osOHMCXi6H29cfpv03kI+KUxRE8JvAQEa4UkEX2BrhUUCls6/XfpIm6ns55FWgMYzROwzG6O0voEBMiADiFU1o+20UoixKEiFrm4Z0X6lV+HK30IQmRTgf4UT2DRcxCFV4fzwAAKWMZ0SkPtX7xKcew1RuEADS3DDi/WcaEixgiDF4AADIKThjEvh2Tmr6GkXkmotSKLOJ0YTfQKjKm4Q9i6GizjOiNKOPop2uFXiF11lPZhCNtLyysUxJkCl9DGl+kjMpCEJAuNaQARULg3WB0c5nK3Dks+KIQinWytqMqhFzcLAFWY5LUv0HYwzObQ1pZR/Kp1MV0s5uTKkDAhkcw48MRmOOahICpEyVi/KOUM2mWyFktMqT+FOLy0pHBjnc3pcKML7zsccFF0Lxn7QAJonTsWIAFN1FBJIAFoVUcr3OqULLa7MqeYRsWA/RoEWstRSBAsWpzfGvQmYg/EyPMPyP0EsnrSwtvsY0ctYbe2jsLbSugkk8rlWgY6Y8jmpxFTRZuYgvmVKelgDA2AMAQCwLifyJKdCVxOIYc1QK4WVGfBedwodNTahdBoZhGUSX0thftGS9hBXcMBipImhhRndCSZjD2WKdHGmfvS/F+1zDvVVdVPYtstXNSLg8vAWBfkZswkNdOytXSTVadzKyr9G4TU1Q2hQXK4UBtdDW+ydbdoIVdNK1pC1/IkEEqYzakNUI1IwHgPOtEanBAWlAkdCgImtM4ApHYjReIeu+tmzdlq4VKpWpo+ys7S2iFNBWxdVlaXWyLbPTdkb2YACs0mviTQ7Nh5dtKujRXCt6VkGa/RskrG660K1QIts+uqRa52bvJezWgClnh8V7kfetMGAEVs7lxVlNVcPDqA4/JJ7su4KHSXrCQQ6G2fQrSwTD+xf2YTI0x7dlSRgVSOd9b2nQT0UbPftTBJF36Qd/nhkd1UK34A9ofGqgkRPNUfh+oqQrdhMI0o0Hc5H1MkBA/taoKcD16yAX/RBFHc3s3iIXfUZ0bw7OPDZozaGiou2eS6X6z7rMNo0E2yptdlXkTYUfYKMGPpJPqFZZ4utBNUIC9FsdlT1aF3WSFGiKWR3IorXqy8saiVrTFTsbK68gPsYK35feFCQ2w1fsceZ6mQ26t5ZzLcqUO1nSGs06OhMqSaaYta21SYAjSknY5cQHr4FBYbfupJLE2K3DMC7Ijik2uHqhkfGYC20twuSljA9Roao+ynQtnjcLnrWl3aldjWoM4xf3YZ0QAkkkLV5UmO+YcMqCZFWFM+6m2Gxapvd8LOrRm7GG/Fdd7hhxsaxYDHYpTm46aSbEAUZCU5htUgyj5MGNUVsdRAOaWA4sIehlPVSCh3Nvc8x1WSDpSTkjjXxBNIr2WDcsUQ6NckggoCWu9TSCb6r6Y5cZnt+1OCVBhOSWgiZisIc6J7NhwmAcwaARWmXMJmdkiV1xBQglPb1Vhhrkd4Skk64CHrgIhqu6exN7TqGdPjNiYTo+i2djxCds116/a67uExJ99Bi3Jn2ZXkVRDQStN9MwsZkDpodmiqzk4FsCTiljOah6duAHBOLcM/iqn9PJh5KpQIdn1SefFkjsWUQ0qXNkpxCSO9El3cs3pUQkGmD5z698jQauC9d6nM54IVzht9yiHmF+OSIVdtBJpUa+z+5tf3dFT57b2VsR/JtrSoJZyhhG0T/9+zPnpeAhb77dVSkne4aHCPz3mHuEz8fHt1xbFov9ASIlyE7XsuBcK5QRdYWwMyq7dwu4T7J5MQoBBAYAsAOiKYWwA4Txt6UY96F4zRxBBwPAbBSjGKFq2weqVbqaqBJIkLfZSiwDrYIocYiq/x7YwY6ra6NgFz7wWqEApoHCKxa4jrsEVr8iVD2BxpDQpr7qbQ8FAbPrE72qOq0DrosTkJZr9YnAZyVyMFP6cgwiTb7xPxSCdoMSu4poVq0D8gQA/aKR2RtaFQ7iJ7ZjtYoCsHKprLbjdpCRXQKC3oqBJJmDgBYBHZWStBxJRR35aItaKQGQyJDjN4IGt4jJRRvjZQdo3RBYHbibDh3Ze7qSmouG/Td4IRBZXb7SXhDi+T+Qpq8QnybIEb5H3pEJVCkiQC4jsSCE8xZqiFUIo6ExBYaGwCcBmxgZdx6GUhAKtCGBiQ1Hh5FRYCQDmEnjCZSo3gXb2K3pBZQFgK0CzhSy1LGix5hSNCDSJ52wn5FRGBGIBExKKKjJ2yTFMTuAmALTXwLwBpBY7GnZzAjI17aS0ypHsxVIKpbGiKGC8JJocq0yFHsyvD/FD7sFqonK+75Gd4VqvBnEgFZadGkoWHHG3EQAmAmEXi/DDjPEAIqqRynLJF4ZEJgABr1qNzBRqbCpYlF6K4xAOiHIvqRZ077BrGfxQlsl1QhKh5fGnYVr2iSxD6jqajyyTwuGckOwikBqVyNzVT0khpS7szp4mFSgfCIEkQHARz7pEG3qUhJJOBRFZAxFPokaxJHDZw3TGkVrZCOpCGYr6l9wSHNT2mUk8oOEBpf7Fx+kMRGlqlFSVD1GcCNG0DNHaauGZTCRmrukuhLbTFmEbb9qumKzlbKyekyIUpmkxAYA6nWQ0p8THCNQITZnNr5wYDaFdw6C/yqSW4iqAYenBlMQUoCHOm1nFkmiJ4VmVJGA2oOq4jyGhYrT1KGA9LNmJn8Edm+k1piE3gJl9lwoDCDmyEjmgryJHC0ZHC/7lmtnxRsCzmYaJYeodFLkHm4R+oYz8j+EWw566j8mqaybaTLn7QoBrnDnkijl3oDpWxsLjGvmXl4ADCYCkibkZLbkq7vx2nAUDB5kWldxbbgEQo2lllAWpq9H9E+bDGQpZovktlJIDDHn3ZgpQU9lZnAWdR9E2gDEkSugWZAJvjCZRb7lJKigIUFm2IxLvylmUVJL5BYBmEMIaIxLeKjJvnszowmG3lLDdYNwNZd48QMywVJJuBphHjgaeJhRJqfGEUVqigmFCXmEmJhR+b5RsXE7JnmFplKkZlBmppgUZEkR+kTyZl7BTmSVFRXDSVgCyVMADKPlHCfQSXAXsROkBqIahEUWqX8ED6OEuUDruUXlJJlC+X+XRmBSKX2J0qWVEJUAkUIbaURYxV5UyI5ATZzn6mQwGH8UGU+EZXcWmL6h8WxVEIXgzEbYPlFpLGZltUyIXjYilFKavhx7PmvZeVMQYCFUkRRULnon9WtK7yaykiRXTq/jGjwx06TWXLWUbZRwbKdC1SEw7W4SuLpV+FyVYI8TZXiV6XTlEKVCflyHfm/IWYrybRqFlWtL8gyFfkKHprFyuYAV1VEJGBGUplB7Ak3hWyLWVIOqdV7rhZ1lhQOVWVDXsTVqjWLHjWg0yKMoNWXUBVYJWkAKtXfWVIVDuBdVonO6hVJKvAQ3mEwngF7A+yw0U1wohAzUvwxKey1S9nAXAA82uXzZsL6gC143Np7X8YRyGgVZo1EIDBM2pnIXgo7nlYWUYUVpAjgXmb+mzqeXAVBwhw4CVAN7uDvTYr7B1SuHNynWgjxVrVbnFqlXa1g1O1Q2YSGCS1w1wpGDekJWITjlHDqR+37S0C/BJigwU70VbrTDe2AJhEO2VA80MX6ka0pUVppWI0pzFKA4mgnXAWzRJiQJDgLQTqiINxRz1SOTOLJ3AVsCcWFkJYcbexmrzbh3sw3ARWrKDLBVHX3qc37R2pDkvUA0IbYb0yqGAX6VEKijPUblaU8UtV7nu3lXN04WWa2wN1Lab0ukTz/md3D1SVp3O5KniFF1JLwA83BS8KX1S2VK4imE2UxlFpYQ2GP1wo+W533n93DKF1f37ROA82hQbIS1D3r2tKgzrC0DDjgyWlQwhTQwqUn1FQ8qwD8rwCyoZ4HwugkoirZThpoNMRZCcAFmCgt7L2QX2K6W70VquKB0BpUI0PeLhJX0VqmmJiNWIO5FDK2kkNty4gmEUFYy+aLktXO5d1FSiie3L3NVu1z0yK8qCEBpSZORXRZ1EJyjGWpk7mNwf0g7SNMSMo83x4lIQOC1Moy2tpWk4LHVAPqnoKUMQLwazX532TG7VFQOVKihBy1J2LiUcoO1UDFFy5ppFXY1sKqT3UO0BAXV3mzUKXvLIaK0yJsi/30Uo5A0TlZ7GNgJYW0VY24UhSMb5O4QDCFMoB0WiAPbGYq47n00VpGA812Lvy+2COcL71e4h3k0+O9pyM0Z/k+xaMyLqygNolukcNEK5A0XVNsklM2w3hvr9P7SvCgMzLRUdOrOmxn10YGxTOONFS3Av1dXzmGNWMKYi3KbzWjOtLVnAjmlcVPpT31Q71HNMSvCL2vVPqbOu2TkfPxQDCDP0Vq3kXbNKOtIPgBDgB7o3KZJa2QuVLYEQAbZainmcbwk7NaZuxm0W24N7YklqS2zTMyKvDdOzV/NtZ9NItwqR2rL7NJpWasXYtTUguWyvNFp3OVKwBhkRlRm/L7M4rxmkutKihVM1PZwlP2Lj7lN4AmDGUiVYICbblrxpOtIm0oDgKp1QDhirLKVXT2RhTbVC1hPDX3kZqqH8n0NELxOZMcs8WGmAsFIJNXUrRZX/qlJNNEJVI811LQ0QsPXpONjSgmEQA1MkonhDI4LesyJJDcNE3RnDPRw2uRLstgPRw0SBsO1OAq3RK5Hs2ItButJVI2NIFAlOSQqis8s2i8gBCV0Wwg5YYeruVGOdN4BfyxCuOFz50CQlneO0v7SwDfMT1x1CvSkg1yuIBaHPFWk1VSPtsDB8sQBNFgAtGkVblf6NDZvAWig82mUo6WPOvMR5sH3v3sqXNEKcBMN7rvVHqzbqs1vauQCCh7oNyCaJI5XHujj2ui0lKD3Vtwqjh9B+WJs4XZXvKxPAWvDLurvruU6bv+w7veEoBoJatW0x6ZlvhXTEHFs8vssSmUIjOAf7ShP2s6o0NAIONyuVAEdv0fWLkkfswhvYCQKy2xkg5rJMdFSCX2tiJaJ8TUftsOogc8ONtObZUo30kO1XDjY1kuX/2fTCSPtwqJgzuCvVWlwmtJIhCuvE3uuBrvK3LBPAWluidgeAmGfQ2xutJGBycBp2KKLKfHtGAStB7SsNImdJJGBOVe39zNbHuvD2fTIu1OcoasvxTqyE2JOWxZb2Qd2ptitlskQHvtM7lytOBueIPSvIo2eVJ+h6dCoMxBUEId0qcR3wOFlUg7F2TyyDToWDvsxOAjs/kZvWkAtTvJeKSk32XHtsjmcxe7DJPsri4TVhW9GscBDwCJhYx8TrT2Qnx9XtuwAUt3rjsMYpvHuVCrfp0oHvNTuyTduiWUg4f6bheNdFScCFe3tt3fTwxFsO1oDin6NFrORYsXcaxddFy5G9edcDduvddWekZQxjdUaBjm2cyW1Er7GnZGhPbcdTWnuT1pxxJtsReGKPDUYkTkTkQRQDgmBgSQCQSYC4CUD4+XDIAGrQSUBAA=";

var Helvetica = "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";

var HelveticaBold = "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";

var HelveticaOblique = "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=";

var TimesRoman = "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";

var TimesBold = "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";

var TimesItalic = "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";

var STANDARD_FONTS = {
  Courier: LZString.decompressFromBase64(Courier),
  'Courier-Bold': LZString.decompressFromBase64(CourierBold),
  'Courier-Oblique': LZString.decompressFromBase64(CourierOblique),
  Helvetica: LZString.decompressFromBase64(Helvetica),
  'Helvetica-Bold': LZString.decompressFromBase64(HelveticaBold),
  'Helvetica-Oblique': LZString.decompressFromBase64(HelveticaOblique),
  'Times-Roman': LZString.decompressFromBase64(TimesRoman),
  'Times-Bold': LZString.decompressFromBase64(TimesBold),
  'Times-Italic': LZString.decompressFromBase64(TimesItalic)
};

var createStandardFont = function createStandardFont(PDFFont) {
  return function (_PDFFont) {
    inherits(StandardFont, _PDFFont);

    function StandardFont(document, name, id) {
      classCallCheck(this, StandardFont);

      var _this = possibleConstructorReturn(this, (StandardFont.__proto__ || Object.getPrototypeOf(StandardFont)).call(this));

      _this.document = document;
      _this.name = name;
      _this.id = id;
      _this.font = new AFMFont(STANDARD_FONTS[_this.name]);
      _this.ascender = _this.font.ascender;
      _this.descender = _this.font.descender;
      _this.bbox = _this.font.bbox;
      _this.lineGap = _this.font.lineGap;
      return _this;
    }

    createClass(StandardFont, [{
      key: 'embed',
      value: function embed() {
        this.dictionary.data = {
          Type: 'Font',
          BaseFont: this.name,
          Subtype: 'Type1',
          Encoding: 'WinAnsiEncoding'
        };

        return this.dictionary.end();
      }
    }, {
      key: 'encode',
      value: function encode(text) {
        var encoded = this.font.encodeText(text);
        var glyphs = this.font.glyphsForString('' + text);
        var advances = this.font.advancesForGlyphs(glyphs);
        var positions = [];

        for (var i = 0; i < glyphs.length; i++) {
          var glyph = glyphs[i];
          positions.push({
            xAdvance: advances[i],
            yAdvance: 0,
            xOffset: 0,
            yOffset: 0,
            advanceWidth: this.font.widthOfGlyph(glyph)
          });
        }

        return [encoded, positions];
      }
    }, {
      key: 'encodeGlyphs',
      value: function encodeGlyphs(glyphs) {
        var res = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(glyphs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var glyph = _step.value;

            res.push(('00' + glyph.id.toString(16)).slice(-2));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return res;
      }
    }, {
      key: 'widthOfString',
      value: function widthOfString(string, size) {
        var glyphs = this.font.glyphsForString('' + string);
        var advances = this.font.advancesForGlyphs(glyphs);

        var width = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Array.from(advances)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var advance = _step2.value;

            width += advance;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var scale = size / 1000;
        return width * scale;
      }
    }], [{
      key: 'isStandardFont',
      value: function isStandardFont(name) {
        return name in STANDARD_FONTS;
      }
    }]);
    return StandardFont;
  }(PDFFont);
};

var toHex = function toHex() {
  for (var _len = arguments.length, codePoints = Array(_len), _key = 0; _key < _len; _key++) {
    codePoints[_key] = arguments[_key];
  }

  var codes = Array.from(codePoints).map(function (code) {
    return ('0000' + code.toString(16)).slice(-4);
  });

  return codes.join('');
};

var createEmbeddedFont = function createEmbeddedFont(PDFFont) {
  return function (_PDFFont) {
    inherits(EmbeddedFont, _PDFFont);

    function EmbeddedFont(document, font, id) {
      classCallCheck(this, EmbeddedFont);

      var _this = possibleConstructorReturn(this, (EmbeddedFont.__proto__ || Object.getPrototypeOf(EmbeddedFont)).call(this));

      _this.document = document;
      _this.font = font;
      _this.id = id;
      _this.subset = _this.font.createSubset();
      _this.unicode = [[0]];
      _this.widths = [_this.font.getGlyph(0).advanceWidth];

      _this.name = _this.font.postscriptName;
      _this.scale = 1000 / _this.font.unitsPerEm;
      _this.ascender = _this.font.ascent * _this.scale;
      _this.descender = _this.font.descent * _this.scale;
      _this.xHeight = _this.font.xHeight * _this.scale;
      _this.capHeight = _this.font.capHeight * _this.scale;
      _this.lineGap = _this.font.lineGap * _this.scale;
      _this.bbox = _this.font.bbox;

      _this.layoutCache = Object.create(null);
      return _this;
    }

    createClass(EmbeddedFont, [{
      key: 'layoutRun',
      value: function layoutRun(text, features) {
        var run = this.font.layout(text, features);

        // Normalize position values
        for (var i = 0; i < run.positions.length; i++) {
          var position = run.positions[i];
          for (var key in position) {
            position[key] *= this.scale;
          }

          position.advanceWidth = run.glyphs[i].advanceWidth * this.scale;
        }

        return run;
      }
    }, {
      key: 'layoutCached',
      value: function layoutCached(text) {
        var cached = void 0;
        if (cached = this.layoutCache[text]) {
          return cached;
        }

        var run = this.layoutRun(text);
        this.layoutCache[text] = run;
        return run;
      }
    }, {
      key: 'layout',
      value: function layout(text, features, onlyWidth) {
        // Skip the cache if any user defined features are applied
        if (onlyWidth == null) {
          onlyWidth = false;
        }
        if (features) {
          return this.layoutRun(text, features);
        }

        var glyphs = onlyWidth ? null : [];
        var positions = onlyWidth ? null : [];
        var advanceWidth = 0;

        // Split the string by words to increase cache efficiency.
        // For this purpose, spaces and tabs are a good enough delimeter.
        var last = 0;
        var index = 0;
        while (index <= text.length) {
          var needle;
          if (index === text.length && last < index || (needle = text.charAt(index), [' ', '\t'].includes(needle))) {
            var run = this.layoutCached(text.slice(last, ++index));
            if (!onlyWidth) {
              glyphs.push.apply(glyphs, toConsumableArray(Array.from(run.glyphs || [])));
              positions.push.apply(positions, toConsumableArray(Array.from(run.positions || [])));
            }

            advanceWidth += run.advanceWidth;
            last = index;
          } else {
            index++;
          }
        }

        return { glyphs: glyphs, positions: positions, advanceWidth: advanceWidth };
      }
    }, {
      key: 'encode',
      value: function encode(text, features) {
        var _layout = this.layout(text, features),
            glyphs = _layout.glyphs,
            positions = _layout.positions;

        var res = [];
        for (var i = 0; i < glyphs.length; i++) {
          var glyph = glyphs[i];
          var gid = this.subset.includeGlyph(glyph.id);
          res.push(('0000' + gid.toString(16)).slice(-4));

          if (this.widths[gid] == null) {
            this.widths[gid] = glyph.advanceWidth * this.scale;
          }
          if (this.unicode[gid] == null) {
            this.unicode[gid] = this.font._cmapProcessor.codePointsForGlyph(glyph.id);
          }
        }

        return [res, positions];
      }
    }, {
      key: 'encodeGlyphs',
      value: function encodeGlyphs(glyphs) {
        var res = [];
        for (var i = 0; i < glyphs.length; i++) {
          var glyph = glyphs[i];
          var gid = this.subset.includeGlyph(glyph.id);
          res.push(('0000' + gid.toString(16)).slice(-4));

          if (this.widths[gid] == null) {
            this.widths[gid] = glyph.advanceWidth * this.scale;
          }
          if (this.unicode[gid] == null) {
            this.unicode[gid] = this.font._cmapProcessor.codePointsForGlyph(glyph.id);
          }
        }

        return res;
      }
    }, {
      key: 'widthOfString',
      value: function widthOfString(string, size, features) {
        var width = this.layout(string, features, true).advanceWidth;
        var scale = size / 1000;
        return width * scale;
      }
    }, {
      key: 'embed',
      value: function embed() {
        var isCFF = this.subset.cff != null;
        var fontFile = this.document.ref();

        if (isCFF) {
          fontFile.data.Subtype = 'CIDFontType0C';
        }

        this.subset.encodeStream().pipe(fontFile);

        var familyClass = ((this.font['OS/2'] != null ? this.font['OS/2'].sFamilyClass : undefined) || 0) >> 8;
        var flags = 0;
        if (this.font.post.isFixedPitch) {
          flags |= 1 << 0;
        }
        if (1 <= familyClass && familyClass <= 7) {
          flags |= 1 << 1;
        }
        flags |= 1 << 2; // assume the font uses non-latin characters
        if (familyClass === 10) {
          flags |= 1 << 3;
        }
        if (this.font.head.macStyle.italic) {
          flags |= 1 << 6;
        }

        // generate a random tag (6 uppercase letters. 65 is the char code for 'A')
        var tag = [0, 1, 2, 3, 4, 5].map(function (i) {
          return String.fromCharCode(Math.random() * 26 + 65);
        }).join('');
        var name = tag + '+' + this.font.postscriptName;

        var bbox = this.font.bbox;

        var descriptor = this.document.ref({
          Type: 'FontDescriptor',
          FontName: name,
          Flags: flags,
          FontBBox: [bbox.minX * this.scale, bbox.minY * this.scale, bbox.maxX * this.scale, bbox.maxY * this.scale],
          ItalicAngle: this.font.italicAngle,
          Ascent: this.ascender,
          Descent: this.descender,
          CapHeight: (this.font.capHeight || this.font.ascent) * this.scale,
          XHeight: (this.font.xHeight || 0) * this.scale,
          StemV: 0
        }); // not sure how to calculate this

        if (isCFF) {
          descriptor.data.FontFile3 = fontFile;
        } else {
          descriptor.data.FontFile2 = fontFile;
        }

        descriptor.end();

        var descendantFont = this.document.ref({
          Type: 'Font',
          Subtype: isCFF ? 'CIDFontType0' : 'CIDFontType2',
          BaseFont: name,
          CIDSystemInfo: {
            Registry: new String('Adobe'),
            Ordering: new String('Identity'),
            Supplement: 0
          },
          FontDescriptor: descriptor,
          W: [0, this.widths]
        });

        descendantFont.end();

        this.dictionary.data = {
          Type: 'Font',
          Subtype: 'Type0',
          BaseFont: name,
          Encoding: 'Identity-H',
          DescendantFonts: [descendantFont],
          ToUnicode: this.toUnicodeCmap()
        };

        return this.dictionary.end();
      }

      // Maps the glyph ids encoded in the PDF back to unicode strings
      // Because of ligature substitutions and the like, there may be one or more
      // unicode characters represented by each glyph.

    }, {
      key: 'toUnicodeCmap',
      value: function toUnicodeCmap() {
        var cmap = this.document.ref();

        var entries = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(this.unicode)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _codePoints = _step.value;

            var encoded = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = Array.from(_codePoints)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var value = _step2.value;

                if (value > 0xffff) {
                  value -= 0x10000;
                  encoded.push(toHex(value >>> 10 & 0x3ff | 0xd800));
                  value = 0xdc00 | value & 0x3ff;
                }

                encoded.push(toHex(value));

                entries.push('<' + encoded.join(' ') + '>');
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        cmap.end('  /CIDInit /ProcSet findresource begin\n  12 dict begin\n  begincmap\n  /CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n  >> def\n  /CMapName /Adobe-Identity-UCS def\n  /CMapType 2 def\n  1 begincodespacerange\n  <0000><ffff>\n  endcodespacerange\n  1 beginbfrange\n  <0000> <' + toHex(entries.length - 1) + '> [' + entries.join(' ') + ']\n  endbfrange\n  endcmap\n  CMapName currentdict /CMap defineresource pop\n  end\n  end  ');

        return cmap;
      }
    }]);
    return EmbeddedFont;
  }(PDFFont);
};

var PDFFont = function () {
  function PDFFont() {
    classCallCheck(this, PDFFont);
  }

  createClass(PDFFont, [{
    key: 'encode',
    value: function encode(text) {
      throw new Error('Must be implemented by subclasses');
    }
  }, {
    key: 'widthOfString',
    value: function widthOfString(text) {
      throw new Error('Must be implemented by subclasses');
    }
  }, {
    key: 'ref',
    value: function ref() {
      return this.dictionary != null ? this.dictionary : this.dictionary = this.document.ref();
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      if (this.embedded || this.dictionary == null) {
        return;
      }

      this.embed();
      return this.embedded = true;
    }
  }, {
    key: 'embed',
    value: function embed() {
      throw new Error('Must be implemented by subclasses');
    }
  }, {
    key: 'lineHeight',
    value: function lineHeight(size, includeGap) {
      if (includeGap == null) {
        includeGap = false;
      }
      var gap = includeGap ? this.lineGap : 0;
      return (this.ascender + gap - this.descender) / 1000 * size;
    }
  }], [{
    key: 'open',
    value: function open(document, src, family, id) {
      var font = void 0;

      if (typeof src === 'string') {
        if (StandardFont.isStandardFont(src)) {
          return new StandardFont(document, src, id);
        }
        font = fontkit.openSync(src, family);
      } else if (Buffer.isBuffer(src)) {
        font = fontkit.create(src, family);
      } else if (src instanceof Uint8Array) {
        font = fontkit.create(new Buffer(src), family);
      } else if (src instanceof ArrayBuffer) {
        font = fontkit.create(new Buffer(new Uint8Array(src)), family);
      } else if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object') {
        font = src;
      }

      if (font == null) {
        throw new Error('Not a supported font format or standard PDF font.');
      }

      return new EmbeddedFont(document, font, id);
    }
  }]);
  return PDFFont;
}();

var StandardFont = createStandardFont(PDFFont);
var EmbeddedFont = createEmbeddedFont(PDFFont);

var Fonts = {
  initFonts: function initFonts() {
    // Lookup table for embedded fonts
    this._fontFamilies = {};
    this._fontCount = 0;

    // Font state
    this._fontSize = 12;
    this._font = null;

    this._registeredFonts = {};

    // Set the default font
    return this.font('Helvetica');
  },
  font: function font(src, family, size) {
    var cacheKey = void 0,
        font = void 0;
    if (typeof family === 'number') {
      size = family;
      family = null;
    }

    // check registered fonts if src is a string
    if (typeof src === 'string' && this._registeredFonts[src]) {
      cacheKey = src;
      var _registeredFonts$src = this._registeredFonts[src];
      src = _registeredFonts$src.src;
      family = _registeredFonts$src.family;
    } else {
      cacheKey = family || src;
      if (typeof cacheKey !== 'string') {
        cacheKey = null;
      }
    }

    if (size != null) {
      this.fontSize(size);
    }

    // fast path: check if the font is already in the PDF
    if (font = this._fontFamilies[cacheKey]) {
      this._font = font;
      return this;
    }

    // load the font
    var id = 'F' + ++this._fontCount;
    this._font = PDFFont.open(this, src, family, id);

    // check for existing font familes with the same name already in the PDF
    // useful if the font was passed as a buffer
    if (font = this._fontFamilies[this._font.name]) {
      this._font = font;
      return this;
    }

    // save the font for reuse later
    if (cacheKey) {
      this._fontFamilies[cacheKey] = this._font;
    }

    if (this._font.name) {
      this._fontFamilies[this._font.name] = this._font;
    }

    return this;
  },
  fontSize: function fontSize(_fontSize) {
    this._fontSize = _fontSize;
    return this;
  },
  currentLineHeight: function currentLineHeight(includeGap) {
    if (includeGap == null) {
      includeGap = false;
    }
    return this._font.lineHeight(this._fontSize, includeGap);
  },
  registerFont: function registerFont(name, src, family) {
    this._registeredFonts[name] = {
      src: src,
      family: family
    };

    return this;
  }
};

var Text = {
  initText: function initText() {
    // Current coordinates
    this.x = 0;
    this.y = 0;
    return this._lineGap = 0;
  },
  text: function text(_text, x, y, options) {
    options = this._initOptions(x, y, options);

    // if the wordSpacing option is specified, remove multiple consecutive spaces
    if (options.wordSpacing) {
      _text = _text.replace(/\s{2,}/g, ' ');
    }

    // render paragraphs as single lines
    var lines = _text.split('\n');

    for (var i = 0; i < lines.length; i++) {
      this._line(lines[i], options);
    }

    return this;
  },
  _initOptions: function _initOptions() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var y = arguments[1];
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
      options = x;
      x = null;
    }

    // Update the current position
    if (x) this.x = x;
    if (y) this.y = y;

    options.columns = options.columns || 0;
    options.columnGap = options.columnGap || 18; // 1/4 inch

    return options;
  },
  _line: function _line(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this._fragment(text, this.x, this.y, options);
  },
  _fragment: function _fragment(text, x, y, options) {
    text = ('' + text).replace(/\n/g, '');

    if (text.length === 0) return;

    // add current font to page if necessary
    if (this.page.fonts[this._font.id] == null) {
      this.page.fonts[this._font.id] = this._font.ref();
    }

    // Glyph encoding and positioning

    var _font$encode = this._font.encode(text, options.features),
        _font$encode2 = slicedToArray(_font$encode, 2),
        encoded = _font$encode2[0],
        positions = _font$encode2[1];

    // Pass down spacings to _glyphs method


    options.wordSpacing = options.wordSpacing || 0;
    options.characterSpacing = options.characterSpacing || 0;

    // Adjust y to match coordinate flipping
    y = this.page.height - y - this._font.ascender / 1000 * this._fontSize;

    this._glyphs(encoded, positions, x, y, options);
  },
  _addGlyphs: function _addGlyphs(glyphs, positions, x, y, options) {
    // add current font to page if necessary
    if (options == null) {
      options = {};
    }
    if (this.page.fonts[this._font.id] == null) {
      this.page.fonts[this._font.id] = this._font.ref();
    }

    // Adjust y to match coordinate flipping
    y = this.page.height - y;

    var scale = 1000 / this._fontSize;
    var unitsPerEm = this._font.font.unitsPerEm || 1000;
    var advanceWidthScale = 1000 / unitsPerEm;

    // Glyph encoding and positioning
    var encodedGlyphs = this._font.encodeGlyphs(glyphs);
    var encodedPositions = positions.map(function (pos, i) {
      return {
        xAdvance: pos.xAdvance * scale,
        yAdvance: pos.yAdvance * scale,
        xOffset: pos.xOffset,
        yOffset: pos.yOffset,
        advanceWidth: glyphs[i].advanceWidth * advanceWidthScale
      };
    });

    return this._glyphs(encodedGlyphs, encodedPositions, x, y, options);
  },
  _glyphs: function _glyphs(encoded, positions, x, y, options) {
    var _this = this;

    // flip coordinate system
    var i = void 0;
    this.save();
    this.transform(1, 0, 0, -1, 0, this.page.height);

    // begin the text object
    this.addContent('BT');

    // text position
    this.addContent('1 0 0 1 ' + PDFObject.number(x) + ' ' + PDFObject.number(y) + ' Tm');

    // font and font size
    this.addContent('/' + this._font.id + ' ' + PDFObject.number(this._fontSize) + ' Tf');

    // rendering mode
    var mode = options.fill && options.stroke ? 2 : options.stroke ? 1 : 0;
    if (mode) {
      this.addContent(mode + ' Tr');
    }

    // Character spacing
    if (options.characterSpacing) {
      this.addContent(PDFObject.number(options.characterSpacing) + ' Tc');
    }

    var scale = this._fontSize / 1000;
    var commands = [];
    var last = 0;
    var hadOffset = false;

    // Adds a segment of text to the TJ command buffer
    var addSegment = function addSegment(cur) {
      if (last < cur) {
        var hex = encoded.slice(last, cur).join('');
        var advance = positions[cur - 1].xAdvance - positions[cur - 1].advanceWidth;
        commands.push('<' + hex + '> ' + PDFObject.number(-advance));
      }

      return last = cur;
    };

    // Flushes the current TJ commands to the output stream
    var flush = function flush(i) {
      addSegment(i);

      if (commands.length > 0) {
        _this.addContent('[' + commands.join(' ') + '] TJ');
        return commands.length = 0;
      }
    };

    for (i = 0; i < positions.length; i++) {
      // If we have an x or y offset, we have to break out of the current TJ command
      // so we can move the text position.
      var pos = positions[i];
      if (pos.xOffset || pos.yOffset) {
        // Flush the current buffer
        flush(i);

        // Move the text position and flush just the current character
        this.addContent('1 0 0 1 ' + PDFObject.number(x + pos.xOffset * scale) + ' ' + PDFObject.number(y + pos.yOffset * scale) + ' Tm');
        flush(i + 1);

        hadOffset = true;
      } else {
        // If the last character had an offset, reset the text position
        if (hadOffset) {
          this.addContent('1 0 0 1 ' + PDFObject.number(x) + ' ' + PDFObject.number(y) + ' Tm');
          hadOffset = false;
        }

        // Group segments that don't have any advance adjustments
        if (pos.xAdvance - pos.advanceWidth !== 0) {
          addSegment(i + 1);
        }
      }

      x += pos.xAdvance * scale;
    }

    // Flush any remaining commands
    flush(i);

    // end the text object
    this.addContent('ET');

    // restore flipped coordinate system
    return this.restore();
  }
};

var Data = function () {
  function Data() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    classCallCheck(this, Data);

    this.pos = 0;
    this.data = data;
    this.length = this.data.length;
  }

  createClass(Data, [{
    key: 'readByte',
    value: function readByte() {
      return this.data[this.pos++];
    }
  }, {
    key: 'writeByte',
    value: function writeByte(byte) {
      return this.data[this.pos++] = byte;
    }
  }, {
    key: 'byteAt',
    value: function byteAt(index) {
      return this.data[index];
    }
  }, {
    key: 'readBool',
    value: function readBool() {
      return !!this.readByte();
    }
  }, {
    key: 'writeBool',
    value: function writeBool(val) {
      return this.writeByte(val ? 1 : 0);
    }
  }, {
    key: 'readUInt32',
    value: function readUInt32() {
      var b1 = this.readByte() * 0x1000000;
      var b2 = this.readByte() << 16;
      var b3 = this.readByte() << 8;
      var b4 = this.readByte();
      return b1 + b2 + b3 + b4;
    }
  }, {
    key: 'writeUInt32',
    value: function writeUInt32(val) {
      this.writeByte(val >>> 24 & 0xff);
      this.writeByte(val >> 16 & 0xff);
      this.writeByte(val >> 8 & 0xff);
      return this.writeByte(val & 0xff);
    }
  }, {
    key: 'readInt32',
    value: function readInt32() {
      var int = this.readUInt32();

      if (int >= 0x80000000) {
        return int - 0x100000000;
      }

      return int;
    }
  }, {
    key: 'writeInt32',
    value: function writeInt32(val) {
      if (val < 0) {
        val += 0x100000000;
      }
      return this.writeUInt32(val);
    }
  }, {
    key: 'readUInt16',
    value: function readUInt16() {
      var b1 = this.readByte() << 8;
      var b2 = this.readByte();
      return b1 | b2;
    }
  }, {
    key: 'writeUInt16',
    value: function writeUInt16(val) {
      this.writeByte(val >> 8 & 0xff);
      return this.writeByte(val & 0xff);
    }
  }, {
    key: 'readInt16',
    value: function readInt16() {
      var int = this.readUInt16();
      if (int >= 0x8000) {
        return int - 0x10000;
      }
      return int;
    }
  }, {
    key: 'writeInt16',
    value: function writeInt16(val) {
      if (val < 0) {
        val += 0x10000;
      }
      return this.writeUInt16(val);
    }
  }, {
    key: 'readString',
    value: function readString(length) {
      var ret = [];
      for (var i = 0, end = length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        ret[i] = String.fromCharCode(this.readByte());
      }

      return ret.join('');
    }
  }, {
    key: 'writeString',
    value: function writeString(val) {
      var _this = this;

      return range(0, val.length, false).map(function (i) {
        return _this.writeByte(val.charCodeAt(i));
      });
    }
  }, {
    key: 'stringAt',
    value: function stringAt(pos, length) {
      this.pos = pos;
      return this.readString(length);
    }
  }, {
    key: 'readShort',
    value: function readShort() {
      return this.readInt16();
    }
  }, {
    key: 'writeShort',
    value: function writeShort(val) {
      return this.writeInt16(val);
    }
  }, {
    key: 'readLongLong',
    value: function readLongLong() {
      var b1 = this.readByte();
      var b2 = this.readByte();
      var b3 = this.readByte();
      var b4 = this.readByte();
      var b5 = this.readByte();
      var b6 = this.readByte();
      var b7 = this.readByte();
      var b8 = this.readByte();

      if (b1 & 0x80) {
        // sign -> avoid overflow
        return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
      }

      return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
    }
  }, {
    key: 'writeLongLong',
    value: function writeLongLong(val) {
      var high = Math.floor(val / 0x100000000);
      var low = val & 0xffffffff;
      this.writeByte(high >> 24 & 0xff);
      this.writeByte(high >> 16 & 0xff);
      this.writeByte(high >> 8 & 0xff);
      this.writeByte(high & 0xff);
      this.writeByte(low >> 24 & 0xff);
      this.writeByte(low >> 16 & 0xff);
      this.writeByte(low >> 8 & 0xff);
      return this.writeByte(low & 0xff);
    }
  }, {
    key: 'readInt',
    value: function readInt() {
      return this.readInt32();
    }
  }, {
    key: 'writeInt',
    value: function writeInt(val) {
      return this.writeInt32(val);
    }
  }, {
    key: 'slice',
    value: function slice(start, end) {
      return this.data.slice(start, end);
    }
  }, {
    key: 'read',
    value: function read(bytes) {
      var buf = [];
      for (var i = 0, end = bytes, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        buf.push(this.readByte());
      }

      return buf;
    }
  }, {
    key: 'write',
    value: function write(bytes) {
      var _this2 = this;

      return Array.from(bytes).map(function (byte) {
        return _this2.writeByte(byte);
      });
    }
  }]);
  return Data;
}();

var MARKERS = [0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc8, 0xffc9, 0xffca, 0xffcb, 0xffcc, 0xffcd, 0xffce, 0xffcf];

var JPEG = function () {
  function JPEG(data, label) {
    classCallCheck(this, JPEG);

    var marker = void 0;
    this.data = data;
    this.label = label;

    if (this.data.readUInt16BE(0) !== 0xffd8) {
      throw 'SOI not found in JPEG';
    }

    var pos = 2;
    while (pos < this.data.length) {
      marker = this.data.readUInt16BE(pos);
      pos += 2;
      if (Array.from(MARKERS).includes(marker)) {
        break;
      }
      pos += this.data.readUInt16BE(pos);
    }

    if (!Array.from(MARKERS).includes(marker)) {
      throw 'Invalid JPEG.';
    }
    pos += 2;

    this.bits = this.data[pos++];
    this.height = this.data.readUInt16BE(pos);
    pos += 2;

    this.width = this.data.readUInt16BE(pos);
    pos += 2;

    var channels = this.data[pos++];
    this.colorSpace = function () {
      switch (channels) {
        case 1:
          return 'DeviceGray';
        case 3:
          return 'DeviceRGB';
        case 4:
          return 'DeviceCMYK';
      }
    }();

    this.obj = null;
  }

  createClass(JPEG, [{
    key: 'embed',
    value: function embed(document) {
      if (this.obj) {
        return;
      }

      this.obj = document.ref({
        Type: 'XObject',
        Subtype: 'Image',
        BitsPerComponent: this.bits,
        Width: this.width,
        Height: this.height,
        ColorSpace: this.colorSpace,
        Filter: 'DCTDecode'
      });

      // add extra decode params for CMYK images. By swapping the
      // min and max values from the default, we invert the colors. See
      // section 4.8.4 of the spec.
      if (this.colorSpace === 'DeviceCMYK') {
        this.obj.data['Decode'] = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0];
      }

      this.obj.end(this.data);

      // free memory
      return this.data = null;
    }
  }]);
  return JPEG;
}();

var PNGImage = function () {
  function PNGImage(data, label) {
    classCallCheck(this, PNGImage);

    this.label = label;
    this.image = new PNG(data);
    this.width = this.image.width;
    this.height = this.image.height;
    this.imgData = this.image.imgData;
    this.obj = null;
  }

  createClass(PNGImage, [{
    key: 'embed',
    value: function embed(document) {
      this.document = document;
      if (this.obj) {
        return;
      }

      this.obj = this.document.ref({
        Type: 'XObject',
        Subtype: 'Image',
        BitsPerComponent: this.image.bits,
        Width: this.width,
        Height: this.height,
        Filter: 'FlateDecode'
      });

      if (!this.image.hasAlphaChannel) {
        var params = this.document.ref({
          Predictor: 15,
          Colors: this.image.colors,
          BitsPerComponent: this.image.bits,
          Columns: this.width
        });

        this.obj.data['DecodeParms'] = params;
        params.end();
      }

      if (this.image.palette.length === 0) {
        this.obj.data['ColorSpace'] = this.image.colorSpace;
      } else {
        // embed the color palette in the PDF as an object stream
        var palette = this.document.ref();
        palette.end(new Buffer(this.image.palette));

        // build the color space array for the image
        this.obj.data['ColorSpace'] = ['Indexed', 'DeviceRGB', this.image.palette.length / 3 - 1, palette];
      }

      // For PNG color types 0, 2 and 3, the transparency data is stored in
      // a dedicated PNG chunk.
      if (this.image.transparency.grayscale) {
        // Use Color Key Masking (spec section 4.8.5)
        // An array with N elements, where N is two times the number of color components.
        var val = this.image.transparency.greyscale;
        return this.obj.data['Mask'] = [val, val];
      } else if (this.image.transparency.rgb) {
        // Use Color Key Masking (spec section 4.8.5)
        // An array with N elements, where N is two times the number of color components.
        var rgb = this.image.transparency.rgb;

        var mask = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(rgb)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var x = _step.value;

            mask.push(x, x);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return this.obj.data['Mask'] = mask;
      } else if (this.image.transparency.indexed) {
        // Create a transparency SMask for the image based on the data
        // in the PLTE and tRNS sections. See below for details on SMasks.
        return this.loadIndexedAlphaChannel();
      } else if (this.image.hasAlphaChannel) {
        // For PNG color types 4 and 6, the transparency data is stored as a alpha
        // channel mixed in with the main image data. Separate this data out into an
        // SMask object and store it separately in the PDF.
        return this.splitAlphaChannel();
      } else {
        return this.finalize();
      }
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      if (this.alphaChannel) {
        var sMask = this.document.ref({
          Type: 'XObject',
          Subtype: 'Image',
          Height: this.height,
          Width: this.width,
          BitsPerComponent: 8,
          Filter: 'FlateDecode',
          ColorSpace: 'DeviceGray',
          Decode: [0, 1]
        });

        sMask.end(this.alphaChannel);
        this.obj.data['SMask'] = sMask;
      }

      // add the actual image data
      this.obj.end(this.imgData);

      // free memory
      this.image = null;
      return this.imgData = null;
    }
  }, {
    key: 'splitAlphaChannel',
    value: function splitAlphaChannel() {
      var _this = this;

      return this.image.decodePixels(function (pixels) {
        var a = void 0,
            p = void 0;
        var colorByteSize = _this.image.colors * _this.image.bits / 8;
        var pixelCount = _this.width * _this.height;
        var imgData = new Buffer(pixelCount * colorByteSize);
        var alphaChannel = new Buffer(pixelCount);

        var i = p = a = 0;
        var len = pixels.length;
        while (i < len) {
          imgData[p++] = pixels[i++];
          imgData[p++] = pixels[i++];
          imgData[p++] = pixels[i++];
          alphaChannel[a++] = pixels[i++];
        }

        var done = 0;
        zlib.deflate(imgData, function (err, imgData1) {
          _this.imgData = imgData1;
          if (err) {
            throw err;
          }
          if (++done === 2) {
            return _this.finalize();
          }
        });

        return zlib.deflate(alphaChannel, function (err, alphaChannel1) {
          _this.alphaChannel = alphaChannel1;
          if (err) {
            throw err;
          }
          if (++done === 2) {
            return _this.finalize();
          }
        });
      });
    }
  }, {
    key: 'loadIndexedAlphaChannel',
    value: function loadIndexedAlphaChannel(fn) {
      var _this2 = this;

      var transparency = this.image.transparency.indexed;
      return this.image.decodePixels(function (pixels) {
        var alphaChannel = new Buffer(_this2.width * _this2.height);

        var i = 0;
        for (var j = 0, end = pixels.length; j < end; j++) {
          alphaChannel[i++] = transparency[pixels[j]];
        }

        return zlib.deflate(alphaChannel, function (err, alphaChannel1) {
          _this2.alphaChannel = alphaChannel1;
          if (err) {
            throw err;
          }
          return _this2.finalize();
        });
      });
    }
  }]);
  return PNGImage;
}();

var PDFImage = function () {
  function PDFImage() {
    classCallCheck(this, PDFImage);
  }

  createClass(PDFImage, null, [{
    key: 'open',
    value: function open(src, label) {
      var data = void 0;
      if (Buffer.isBuffer(src)) {
        data = src;
      } else if (src instanceof ArrayBuffer) {
        data = new Buffer(new Uint8Array(src));
      } else {
        var match = /^data:.+;base64,(.*)$/.exec(src);
        if (match) {
          data = new Buffer(match[1], 'base64');
        } else {
          data = fs.readFileSync(src);
          if (!data) return;
        }
      }

      if (data[0] === 0xff && data[1] === 0xd8) {
        return new JPEG(data, label);
      } else if (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG') {
        return new PNGImage(data, label);
      } else {
        throw new Error('Unknown image format.');
      }
    }
  }]);
  return PDFImage;
}();

var Images = {
  initImages: function initImages() {
    this._imageRegistry = {};
    return this._imageCount = 0;
  },
  image: function image(src, x, y, options) {
    var bh = void 0,
        bp = void 0,
        bw = void 0,
        image = void 0,
        ip = void 0,
        left = void 0,
        left1 = void 0;
    if (options == null) {
      options = {};
    }
    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
      options = x;
      x = null;
    }

    x = (left = x != null ? x : options.x) != null ? left : this.x;
    y = (left1 = y != null ? y : options.y) != null ? left1 : this.y;

    if (typeof src === 'string') {
      image = this._imageRegistry[src];
    }

    if (!image) {
      if (src.width && src.height) {
        image = src;
      } else {
        image = this.openImage(src);
      }
    }

    if (!image.obj) {
      image.embed(this);
    }

    if (this.page.xobjects[image.label] == null) {
      this.page.xobjects[image.label] = image.obj;
    }

    var w = options.width || image.width;
    var h = options.height || image.height;

    if (options.width && !options.height) {
      var wp = w / image.width;
      w = image.width * wp;
      h = image.height * wp;
    } else if (options.height && !options.width) {
      var hp = h / image.height;
      w = image.width * hp;
      h = image.height * hp;
    } else if (options.scale) {
      w = image.width * options.scale;
      h = image.height * options.scale;
    } else if (options.fit) {
      var _Array$from = Array.from(options.fit);

      var _Array$from2 = slicedToArray(_Array$from, 2);

      bw = _Array$from2[0];
      bh = _Array$from2[1];

      bp = bw / bh;
      ip = image.width / image.height;
      if (ip > bp) {
        w = bw;
        h = bw / ip;
      } else {
        h = bh;
        w = bh * ip;
      }
    } else if (options.cover) {
      var _Array$from3 = Array.from(options.cover);

      var _Array$from4 = slicedToArray(_Array$from3, 2);

      bw = _Array$from4[0];
      bh = _Array$from4[1];

      bp = bw / bh;
      ip = image.width / image.height;
      if (ip > bp) {
        h = bh;
        w = bh * ip;
      } else {
        w = bw;
        h = bw / ip;
      }
    }

    if (options.fit || options.cover) {
      if (options.align === 'center') {
        x = x + bw / 2 - w / 2;
      } else if (options.align === 'right') {
        x = x + bw - w;
      }

      if (options.valign === 'center') {
        y = y + bh / 2 - h / 2;
      } else if (options.valign === 'bottom') {
        y = y + bh - h;
      }
    }

    // create link annotations if the link option is given
    if (options.link != null) {
      this.link(x, y, w, h, options.link);
    }
    if (options.goTo != null) {
      this.goTo(x, y, w, h, options.goTo);
    }
    if (options.destination != null) {
      this.addNamedDestination(options.destination, 'XYZ', x, y, null);
    }

    // Set the current y position to below the image if it is in the document flow
    if (this.y === y) {
      this.y += h;
    }

    this.save();
    this.transform(w, 0, 0, -h, x, y + h);
    this.addContent('/' + image.label + ' Do');
    this.restore();

    return this;
  },
  openImage: function openImage(src) {
    var image = void 0;
    if (typeof src === 'string') {
      image = this._imageRegistry[src];
    }

    if (!image) {
      image = PDFImage.open(src, 'I' + ++this._imageCount);
      if (typeof src === 'string') {
        this._imageRegistry[src] = image;
      }
    }

    return image;
  }
};

var Annotations = {
  annotate: function annotate(x, y, w, h, options) {
    options.Type = 'Annot';
    options.Rect = this._convertRect(x, y, w, h);
    options.Border = [0, 0, 0];
    if (options.Subtype !== 'Link') {
      if (options.C == null) {
        options.C = this._normalizeColor(options.color || [0, 0, 0]);
      }
    } // convert colors
    delete options.color;

    if (typeof options.Dest === 'string') {
      options.Dest = new String(options.Dest);
    }

    // Capitalize keys
    for (var key in options) {
      var val = options[key];
      options[key[0].toUpperCase() + key.slice(1)] = val;
    }

    var ref = this.ref(options);
    this.page.annotations.push(ref);
    ref.end();
    return this;
  },
  note: function note(x, y, w, h, contents, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Text';
    options.Contents = new String(contents);
    options.Name = 'Comment';
    if (options.color == null) {
      options.color = [243, 223, 92];
    }
    return this.annotate(x, y, w, h, options);
  },
  goTo: function goTo(x, y, w, h, name, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Link';
    options.A = this.ref({
      S: 'GoTo',
      D: new String(name)
    });
    options.A.end();
    return this.annotate(x, y, w, h, options);
  },
  link: function link(x, y, w, h, url, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Link';

    if (typeof url === 'number') {
      // Link to a page in the document (the page must already exist)
      var pages = this._root.data.Pages.data;
      if (url >= 0 && url < pages.Kids.length) {
        options.A = this.ref({
          S: 'GoTo',
          D: [pages.Kids[url], 'XYZ', null, null, null]
        });
        options.A.end();
      } else {
        throw new Error('The document has no page ' + url);
      }
    } else {
      // Link to an external url
      options.A = this.ref({
        S: 'URI',
        URI: new String(url)
      });
      options.A.end();
    }

    return this.annotate(x, y, w, h, options);
  },
  _markup: function _markup(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }

    var _Array$from = Array.from(this._convertRect(x, y, w, h)),
        _Array$from2 = slicedToArray(_Array$from, 4),
        x1 = _Array$from2[0],
        y1 = _Array$from2[1],
        x2 = _Array$from2[2],
        y2 = _Array$from2[3];

    options.QuadPoints = [x1, y2, x2, y2, x1, y1, x2, y1];
    options.Contents = new String();
    return this.annotate(x, y, w, h, options);
  },
  highlight: function highlight(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Highlight';
    if (options.color == null) {
      options.color = [241, 238, 148];
    }
    return this._markup(x, y, w, h, options);
  },
  underline: function underline(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Underline';
    return this._markup(x, y, w, h, options);
  },
  strike: function strike(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'StrikeOut';
    return this._markup(x, y, w, h, options);
  },
  lineAnnotation: function lineAnnotation(x1, y1, x2, y2, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Line';
    options.Contents = new String();
    options.L = [x1, this.page.height - y1, x2, this.page.height - y2];
    return this.annotate(x1, y1, x2, y2, options);
  },
  rectAnnotation: function rectAnnotation(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Square';
    options.Contents = new String();
    return this.annotate(x, y, w, h, options);
  },
  ellipseAnnotation: function ellipseAnnotation(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Circle';
    options.Contents = new String();
    return this.annotate(x, y, w, h, options);
  },
  textAnnotation: function textAnnotation(x, y, w, h, text, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'FreeText';
    options.Contents = new String(text);
    options.DA = new String();
    return this.annotate(x, y, w, h, options);
  },
  _convertRect: function _convertRect(x1, y1, w, h) {
    // flip y1 and y2
    var y2 = y1;
    y1 += h;

    // make x2
    var x2 = x1 + w;

    // apply current transformation matrix to points

    var _Array$from3 = Array.from(this._ctm),
        _Array$from4 = slicedToArray(_Array$from3, 6),
        m0 = _Array$from4[0],
        m1 = _Array$from4[1],
        m2 = _Array$from4[2],
        m3 = _Array$from4[3],
        m4 = _Array$from4[4],
        m5 = _Array$from4[5];

    x1 = m0 * x1 + m2 * y1 + m4;
    y1 = m1 * x1 + m3 * y1 + m5;
    x2 = m0 * x2 + m2 * y2 + m4;
    y2 = m1 * x2 + m3 * y2 + m5;

    return [x1, y1, x2, y2];
  }
};

var PDFDocument$1 = function (_stream$Readable) {
  inherits(PDFDocument, _stream$Readable);

  function PDFDocument() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, PDFDocument);

    var _this = possibleConstructorReturn(this, (PDFDocument.__proto__ || Object.getPrototypeOf(PDFDocument)).call(this));

    _this.options = options;
    _this.version = 1.3;
    _this.compress = true;
    _this._pageBuffer = [];
    _this._pageBufferStart = 0;

    // The PDF object store
    _this._offsets = [];
    _this._waiting = 0;
    _this._ended = false;
    _this._offset = 0;

    var Names = _this.ref({
      Dests: new PDFNameTree()
    });

    _this._root = _this.ref({
      Type: 'Catalog',
      Pages: _this.ref({
        Type: 'Pages',
        Count: 0,
        Kids: []
      }),
      Names: Names
    });

    // The current page
    _this.page = null;

    // Initialize mixins
    _this.initColor();
    _this.initVector();
    _this.initFonts();
    _this.initText();
    _this.initImages();

    // Initialize the metadata
    _this.info = {
      Producer: 'PDFKit',
      Creator: 'PDFKit',
      CreationDate: new Date()
    };

    if (_this.options.info) {
      for (var key in _this.options.info) {
        var val = _this.options.info[key];
        _this.info[key] = val;
      }
    }

    // Write the header PDF version
    _this._write('%PDF-' + _this.version);

    // 4 binary chars, as recommended by the spec
    _this._write('%\xFF\xFF\xFF\xFF');

    // Add the first page
    if (_this.options.autoFirstPage !== false) {
      _this.addPage();
    }
    return _this;
  }

  createClass(PDFDocument, [{
    key: 'addPage',
    value: function addPage(options) {
      // end the current page if needed
      if (options == null) {
        options = this.options;
      }

      if (!this.options.bufferPages) {
        this.flushPages();
      }

      // create a page object
      this.page = new PDFPage(this, options);
      this._pageBuffer.push(this.page);

      // add the page to the object store
      var pages = this._root.data.Pages.data;
      pages.Kids.push(this.page.dictionary);
      pages.Count++;

      // flip PDF coordinate system so that the origin is in
      // the top left rather than the bottom left
      this._ctm = [1, 0, 0, 1, 0, 0];
      this.transform(1, 0, 0, -1, 0, this.page.height);

      return this;
    }
  }, {
    key: 'flushPages',
    value: function flushPages() {
      // this local variable exists so we're future-proof against
      // reentrant calls to flushPages.
      var pages = this._pageBuffer;
      this._pageBuffer = [];
      this._pageBufferStart += pages.length;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.from(pages)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var page = _step.value;

          page.end();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'addNamedDestination',
    value: function addNamedDestination(name) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length === 0) {
        args = ['XYZ', null, null, null];
      }
      if (args[0] === 'XYZ' && args[2] !== null) {
        args[2] = this.page.height - args[2];
      }
      args.unshift(this.page.dictionary);
      this._root.data.Names.data.Dests.add(name, args);
    }
  }, {
    key: 'ref',
    value: function ref(data) {
      var ref = new PDFReference(this, this._offsets.length + 1, data);
      this._offsets.push(null); // placeholder for this object's offset once it is finalized
      this._waiting++;
      return ref;
    }
  }, {
    key: '_read',
    value: function _read() {
      // do nothing, but this method is required by node
    }
  }, {
    key: '_write',
    value: function _write(data) {
      if (!Buffer.isBuffer(data)) {
        data = new Buffer(data + '\n', 'binary');
      }

      this.push(data);
      return this._offset += data.length;
    }
  }, {
    key: 'addContent',
    value: function addContent(data) {
      this.page.write(data);
      return this;
    }
  }, {
    key: '_refEnd',
    value: function _refEnd(ref) {
      this._offsets[ref.id - 1] = ref.offset;
      if (--this._waiting === 0 && this._ended) {
        this._finalize();
        return this._ended = false;
      }
    }
  }, {
    key: 'end',
    value: function end() {
      this.flushPages();
      this._info = this.ref();
      for (var key in this.info) {
        var val = this.info[key];
        if (typeof val === 'string') {
          val = new String(val);
        }

        this._info.data[key] = val;
      }

      this._info.end();

      for (var name in this._fontFamilies) {
        var font = this._fontFamilies[name];
        font.finalize();
      }

      this._root.end();
      this._root.data.Pages.end();
      this._root.data.Names.end();

      if (this._waiting === 0) {
        return this._finalize();
      } else {
        return this._ended = true;
      }
    }
  }, {
    key: '_finalize',
    value: function _finalize(fn) {
      // generate xref
      var xRefOffset = this._offset;
      this._write('xref');
      this._write('0 ' + (this._offsets.length + 1));
      this._write('0000000000 65535 f ');

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.from(this._offsets)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var offset = _step2.value;

          offset = ('0000000000' + offset).slice(-10);
          this._write(offset + ' 00000 n ');
        }

        // trailer
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._write('trailer');
      this._write(PDFObject.convert({
        Size: this._offsets.length + 1,
        Root: this._root,
        Info: this._info
      }));

      this._write('startxref');
      this._write('' + xRefOffset);
      this._write('%%EOF');

      // end the stream
      return this.push(null);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object PDFDocument]';
    }
  }]);
  return PDFDocument;
}(stream.Readable);

var mixin = function mixin(methods) {
  return function () {
    var result = [];
    for (var name in methods) {
      var method = methods[name];
      result.push(PDFDocument$1.prototype[name] = method);
    }
    return result;
  }();
};

// Load mixins
mixin(Color);
mixin(Vector);
mixin(Fonts);
mixin(Text);
mixin(Images);
mixin(Annotations);

exports['default'] = PDFDocument$1;
exports.PDFFont = PDFFont;
exports.StandardFont = StandardFont;
exports.EmbeddedFont = EmbeddedFont;
