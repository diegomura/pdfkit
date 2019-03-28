/*
PDFImage - embeds images in PDF documents
By Devon Govett
*/

import fs from 'fs'
import JPEG from './image/jpeg'
import PNG from './image/png'
import GIF from './image/gif'

class PDFImage {
  static open(src, label, options) {
    let data
    if (Buffer.isBuffer(src)) {
      data = src
    } else if (src instanceof ArrayBuffer) {
      data = new Buffer(new Uint8Array(src))
    } else {
      let match
      if ((match = /^data:.+;base64,(.*)$/.exec(src))) {
        data = new Buffer(match[1], 'base64')
      } else if (!BROWSER) {
        data = fs.readFileSync(src)
        if (!data) {
          return
        }
      }
    }

    if (data[0] === 0xff && data[1] === 0xd8) {
      return new JPEG(data, label, options)
    } else if (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG') {
      return new PNG(data, label, options)
    } else if (data[0] === 71 && data[1] === 73 && data[2] === 70) {
      return new GIF(data, label, options)
    } else {
      throw new Error('Unknown image format.')
    }
  }
}

export default PDFImage
