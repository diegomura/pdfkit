/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fontkit = require('fontkit');

class PDFFont {
  static open(document, src, family, id) {
    let font;
    if (src.constructor.name === 'TTFFont') {
      font = src;

    } else if (typeof src === 'string') {
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
    }

    if ((font == null)) {
      throw new Error('Not a supported font format or standard PDF font.');
    }

    return new EmbeddedFont(document, font, id);
  }

  encode(text) {
    throw new Error('Must be implemented by subclasses');
  }

  widthOfString(text) {
    throw new Error('Must be implemented by subclasses');
  }

  ref() {
    return this.dictionary != null ? this.dictionary : (this.dictionary = this.document.ref());
  }

  finalize() {
    if (this.embedded || (this.dictionary == null)) { return; }

    this.embed();
    return this.embedded = true;
  }

  embed() {
    throw new Error('Must be implemented by subclasses');
  }

  lineHeight(size, includeGap) {
    if (includeGap == null) { includeGap = false; }
    const gap = includeGap ? this.lineGap : 0;
    return (((this.ascender + gap) - this.descender) / 1000) * size;
  }
}

module.exports = PDFFont;

var StandardFont = require('./font/standard');
var EmbeddedFont = require('./font/embedded');
