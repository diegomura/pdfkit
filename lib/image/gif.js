import GIFuct from './gifuct-js';

const COLOR_SPACE_MAP = {
  1: 'DeviceGray',
  3: 'DeviceRGB',
  4: 'DeviceCMYK'
}
class GIF {
  constructor(data, label, { width, height } = {}) {
    this.data = data;
    this.label = label;

    // validate data integrity

    // assign bits per component to this.bits
    this.bits = 8;

    // assign image width and height to this.width and this.height
    this.width = width || 0;
    this.height = height || 0;

    this.colorSpace = COLOR_SPACE_MAP[3];

    this.obj = null;
  }

  embed(document) {
    if (this.obj) { return; }

    const gif = new GIFuct(this.data);
    const data = gif.getFrame(0, false, false);
    console.log('Data from GIFuct:', data);

    this.obj = document.ref({
      Type: 'XObject',
      Subtype: 'Image',
      BitsPerComponent: this.bits,
      Width: this.width,
      Height: this.height,
      ColorSpace: this.colorSpace,
      Filter: data.format === 'lzw' ? 'LZWDecode' : 'FlateDecode',
    });

    this.obj.end(data);

    // free memory
    return this.data = null;
  }
};

export default GIF;
