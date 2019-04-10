<<<<<<< HEAD
import fontkit from '@react-pdf/fontkit';
=======
import fs from 'fs';
import fontkit from 'fontkit';
>>>>>>> upstream/master
import StandardFont from './font/standard';
import EmbeddedFont from './font/embedded';

export class PDFFontFactory {
  static open(document, src, family, id) {
    let font;
    if (typeof src === 'string') {
      if (StandardFont.isStandardFont(src)) {
        return new StandardFont(document, src, id);
      }

<<<<<<< HEAD
      font = fontkit.openSync(src, family);

    } else if (Buffer.isBuffer(src)) {
      font = fontkit.create(src, family);

    } else if (src instanceof Uint8Array) {
      font = fontkit.create(new Buffer(src), family);

=======
      src = fs.readFileSync(src);
    }
    if (Buffer.isBuffer(src)) {
      font = fontkit.create(src, family);
    } else if (src instanceof Uint8Array) {
      font = fontkit.create(new Buffer(src), family);
>>>>>>> upstream/master
    } else if (src instanceof ArrayBuffer) {
      font = fontkit.create(new Buffer(new Uint8Array(src)), family);

    } else if (typeof src === 'object') {
      font = src;
    }

<<<<<<< HEAD
    if ((font == null)) {
=======
    if (font == null) {
>>>>>>> upstream/master
      throw new Error('Not a supported font format or standard PDF font.');
    }

    return new EmbeddedFont(document, font, id);
  }
}

<<<<<<< HEAD

=======
>>>>>>> upstream/master
export default PDFFontFactory;
