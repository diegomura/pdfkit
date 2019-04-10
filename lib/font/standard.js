import LZString from 'lz-string'
import AFMFont from './afm'
import PDFFont from '../font'
import Courier from './data/Courier.b64.afm'
import CourierBold from './data/Courier-Bold.b64.afm'
import CourierOblique from './data/Courier-Oblique.b64.afm'
import Helvetica from './data/Helvetica.b64.afm'
import HelveticaBold from './data/Helvetica-Bold.b64.afm'
import HelveticaOblique from './data/Helvetica-Oblique.b64.afm'
import TimesRoman from './data/Times-Roman.b64.afm'
import TimesBold from './data/Times-Bold.b64.afm'
import TimesItalic from './data/Times-Italic.b64.afm'

const STANDARD_FONTS = {
<<<<<<< HEAD
  Courier: LZString.decompressFromBase64(Courier),
  'Courier-Bold': LZString.decompressFromBase64(CourierBold),
  'Courier-Oblique': LZString.decompressFromBase64(CourierOblique),
  Helvetica: LZString.decompressFromBase64(Helvetica),
  'Helvetica-Bold': LZString.decompressFromBase64(HelveticaBold),
  'Helvetica-Oblique': LZString.decompressFromBase64(HelveticaOblique),
  'Times-Roman': LZString.decompressFromBase64(TimesRoman),
  'Times-Bold': LZString.decompressFromBase64(TimesBold),
  'Times-Italic': LZString.decompressFromBase64(TimesItalic)
}

class StandardFont extends PDFFont {
  constructor(document, name, id) {
    super()
    this.document = document
    this.name = name
    this.id = id
    this.font = new AFMFont(STANDARD_FONTS[this.name])
    ;({
=======
  Courier() {
    return fs.readFileSync(__dirname + '/data/Courier.afm', 'utf8');
  },
  'Courier-Bold'() {
    return fs.readFileSync(__dirname + '/data/Courier-Bold.afm', 'utf8');
  },
  'Courier-Oblique'() {
    return fs.readFileSync(__dirname + '/data/Courier-Oblique.afm', 'utf8');
  },
  'Courier-BoldOblique'() {
    return fs.readFileSync(__dirname + '/data/Courier-BoldOblique.afm', 'utf8');
  },
  Helvetica() {
    return fs.readFileSync(__dirname + '/data/Helvetica.afm', 'utf8');
  },
  'Helvetica-Bold'() {
    return fs.readFileSync(__dirname + '/data/Helvetica-Bold.afm', 'utf8');
  },
  'Helvetica-Oblique'() {
    return fs.readFileSync(__dirname + '/data/Helvetica-Oblique.afm', 'utf8');
  },
  'Helvetica-BoldOblique'() {
    return fs.readFileSync(
      __dirname + '/data/Helvetica-BoldOblique.afm',
      'utf8'
    );
  },
  'Times-Roman'() {
    return fs.readFileSync(__dirname + '/data/Times-Roman.afm', 'utf8');
  },
  'Times-Bold'() {
    return fs.readFileSync(__dirname + '/data/Times-Bold.afm', 'utf8');
  },
  'Times-Italic'() {
    return fs.readFileSync(__dirname + '/data/Times-Italic.afm', 'utf8');
  },
  'Times-BoldItalic'() {
    return fs.readFileSync(__dirname + '/data/Times-BoldItalic.afm', 'utf8');
  },
  Symbol() {
    return fs.readFileSync(__dirname + '/data/Symbol.afm', 'utf8');
  },
  ZapfDingbats() {
    return fs.readFileSync(__dirname + '/data/ZapfDingbats.afm', 'utf8');
  }
};

class StandardFont extends PDFFont {
  constructor(document, name, id) {
    super();
    this.document = document;
    this.name = name;
    this.id = id;
    this.font = new AFMFont(STANDARD_FONTS[this.name]());
    ({
>>>>>>> upstream/master
      ascender: this.ascender,
      descender: this.descender,
      bbox: this.bbox,
      lineGap: this.lineGap,
      xHeight: this.xHeight,
      capHeight: this.capHeight
<<<<<<< HEAD
    } = this.font)
=======
    } = this.font);
>>>>>>> upstream/master
  }

  embed() {
    this.dictionary.data = {
      Type: 'Font',
      BaseFont: this.name,
      Subtype: 'Type1',
      Encoding: 'WinAnsiEncoding'
<<<<<<< HEAD
    }

    return this.dictionary.end()
=======
    };

    return this.dictionary.end();
>>>>>>> upstream/master
  }

  encode(text) {
    const encoded = this.font.encodeText(text)
    const glyphs = this.font.glyphsForString(`${text}`)
    const advances = this.font.advancesForGlyphs(glyphs)
    const positions = []
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i]
      positions.push({
        xAdvance: advances[i],
        yAdvance: 0,
        xOffset: 0,
        yOffset: 0,
        advanceWidth: this.font.widthOfGlyph(glyph)
      })
    }

    return [encoded, positions]
  }

  encodeGlyphs(glyphs) {
    const res = []

    for (let glyph of Array.from(glyphs)) {
      res.push(`00${glyph.id.toString(16)}`.slice(-2));
    }

<<<<<<< HEAD
    return res;
  }

  widthOfString(string, size) {
    const glyphs = this.font.glyphsForString(`${string}`)
    const advances = this.font.advancesForGlyphs(glyphs)

    let width = 0
=======
    return [encoded, positions];
  }

  widthOfString(string, size) {
    const glyphs = this.font.glyphsForString(`${string}`);
    const advances = this.font.advancesForGlyphs(glyphs);

    let width = 0;
>>>>>>> upstream/master
    for (let advance of advances) {
      width += advance
    }

<<<<<<< HEAD
    const scale = size / 1000
    return width * scale
=======
    const scale = size / 1000;
    return width * scale;
>>>>>>> upstream/master
  }

  static isStandardFont(name) {
    return name in STANDARD_FONTS
  }
}

<<<<<<< HEAD
export default StandardFont
=======
export default StandardFont;
>>>>>>> upstream/master
