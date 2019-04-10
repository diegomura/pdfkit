const MARKERS = [
  0xffc0,
  0xffc1,
  0xffc2,
  0xffc3,
  0xffc5,
  0xffc6,
  0xffc7,
  0xffc8,
  0xffc9,
  0xffca,
  0xffcb,
  0xffcc,
  0xffcd,
  0xffce,
  0xffcf
];

const COLOR_SPACE_MAP = {
  1: 'DeviceGray',
  3: 'DeviceRGB',
  4: 'DeviceCMYK'
<<<<<<< HEAD
}
=======
};

>>>>>>> upstream/master
class JPEG {
  constructor(data, label) {
    let marker;
    this.data = data;
    this.label = label;
<<<<<<< HEAD

    if (this.data.readUInt16BE(0) !== 0xFFD8) {
      throw "SOI not found in JPEG";
=======
    if (this.data.readUInt16BE(0) !== 0xffd8) {
      throw 'SOI not found in JPEG';
>>>>>>> upstream/master
    }

    let pos = 2;
    while (pos < this.data.length) {
      marker = this.data.readUInt16BE(pos);
      pos += 2;
<<<<<<< HEAD

      if (MARKERS.includes(marker)) { break; }
      pos += this.data.readUInt16BE(pos);
    }

    if (!MARKERS.includes(marker)) { throw "Invalid JPEG."; }

=======
      if (MARKERS.includes(marker)) {
        break;
      }
      pos += this.data.readUInt16BE(pos);
    }

    if (!MARKERS.includes(marker)) {
      throw 'Invalid JPEG.';
    }
>>>>>>> upstream/master
    pos += 2;

    this.bits = this.data[pos++];
    this.height = this.data.readUInt16BE(pos);
    pos += 2;

    this.width = this.data.readUInt16BE(pos);
    pos += 2;

    const channels = this.data[pos++];
    this.colorSpace = COLOR_SPACE_MAP[channels];

    this.obj = null;
  }

  embed(document) {
<<<<<<< HEAD
    if (this.obj) { return; }
=======
    if (this.obj) {
      return;
    }
>>>>>>> upstream/master

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
    return (this.data = null);
  }
<<<<<<< HEAD
};
=======
}
>>>>>>> upstream/master

export default JPEG;
