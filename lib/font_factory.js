import fs from 'fs';
import fontkit from '@react-pdf/fontkit';
import StandardFont from './font/standard';
import EmbeddedFont from './font/embedded';

export class PDFFontFactory {
  static open(document, src, family, id) {
    let font;
    if (typeof src === 'string') {
      if (StandardFont.isStandardFont(src)) {
        return new StandardFont(document, src, id);
      }

      src = fs.readFileSync(src);
    }
    if (Buffer.isBuffer(src)) {
      font = fontkit.create(src, family);
    } else if (src instanceof Uint8Array) {
      font = fontkit.create(new Buffer(src), family);
    } else if (src instanceof ArrayBuffer) {
      font = fontkit.create(new Buffer(new Uint8Array(src)), family);

    } else if (typeof src === 'object') {
      font = src;
    }

    if (font == null) {
      throw new Error('Not a supported font format or standard PDF font.');
    }

    return new EmbeddedFont(document, font, id);
  }
}

export default PDFFontFactory;
