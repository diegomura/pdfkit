const Data = require('./data');
const JPEG = require('./image/jpeg');
const PNG = require('./image/png');

class PDFImage {
  static open(src, label) {
    let data;
    if (Buffer.isBuffer(src)) {
      data = src;
    } else if (src instanceof ArrayBuffer) {
      data = new Buffer(new Uint8Array(src));
    } else {
      let match;
      if (match = /^data:.+;base64,(.*)$/.exec(src)) {
        data = new Buffer(match[1], 'base64');
      }
    }

    if ((data[0] === 0xff) && (data[1] === 0xd8)) {
      return new JPEG(data, label);

    } else if ((data[0] === 0x89) && (data.toString('ascii', 1, 4) === 'PNG')) {
      return new PNG(data, label);

    } else {
      throw new Error('Unknown image format.');
    }
  }
}

module.exports = PDFImage;
