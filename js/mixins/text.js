/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {number} = require('../object');

module.exports = {
  initText() {
    // Current coordinates
    this.x = 0;
    this.y = 0;
    return this._lineGap = 0;
  },

  _addGlyphs(glyphs, positions, x, y, options) {
    // add current font to page if necessary
    if (options == null) { options = {}; }
    if (this.page.fonts[this._font.id] == null) { this.page.fonts[this._font.id] = this._font.ref(); }

    // Adjust y to match coordinate flipping
    y = this.page.height - y;

    const scale = (1000 / this._fontSize);
    const unitsPerEm = this._font.font.unitsPerEm || 1000;
    const advanceWidthScale = (1000 / unitsPerEm);

    // Glyph encoding and positioning
    const encodedGlyphs = this._font.encodeGlyphs(glyphs);
    const encodedPositions = positions.map((pos, i) =>
      ({
        xAdvance: pos.xAdvance * scale,
        yAdvance: pos.yAdvance * scale,
        xOffset: pos.xOffset,
        yOffset: pos.yOffset,
        advanceWidth: glyphs[i].advanceWidth * advanceWidthScale
      })
    );

    return this._glyphs(encodedGlyphs, encodedPositions, x, y, options);
  },

  _glyphs(encoded, positions, x, y, options) {
    // flip coordinate system
    let i;
    this.save();
    this.transform(1, 0, 0, -1, 0, this.page.height);

    // begin the text object
    this.addContent("BT");

    // text position
    this.addContent(`1 0 0 1 ${number(x)} ${number(y)} Tm`);

    // font and font size
    this.addContent(`/${this._font.id} ${number(this._fontSize)} Tf`);

    // rendering mode
    const mode = options.fill && options.stroke ? 2 : options.stroke ? 1 : 0;
    if (mode) { this.addContent(`${mode} Tr`); }

    // Character spacing
    if (options.characterSpacing) { this.addContent(`${number(options.characterSpacing)} Tc`); }

    const scale = this._fontSize / 1000;
    const commands = [];
    let last = 0;
    let hadOffset = false;

    // Adds a segment of text to the TJ command buffer
    const addSegment = cur => {
      if (last < cur) {
        const hex = encoded.slice(last, cur).join('');
        const advance = positions[cur - 1].xAdvance - positions[cur - 1].advanceWidth;
        commands.push(`<${hex}> ${number(-advance)}`);
      }

      return last = cur;
    };

    // Flushes the current TJ commands to the output stream
    const flush = i => {
      addSegment(i);

      if (commands.length > 0) {
        this.addContent(`[${commands.join(' ')}] TJ`);
        return commands.length = 0;
      }
    };

    for (i = 0; i < positions.length; i++) {
      // If we have an x or y offset, we have to break out of the current TJ command
      // so we can move the text position.
      const pos = positions[i];
      if (pos.xOffset || pos.yOffset) {
        // Flush the current buffer
        flush(i);

        // Move the text position and flush just the current character
        this.addContent(`1 0 0 1 ${number(x + (pos.xOffset * scale))} ${number(y + (pos.yOffset * scale))} Tm`);
        flush(i + 1);

        hadOffset = true;
      } else {
        // If the last character had an offset, reset the text position
        if (hadOffset) {
          this.addContent(`1 0 0 1 ${number(x)} ${number(y)} Tm`);
          hadOffset = false;
        }

        // Group segments that don't have any advance adjustments
        if ((pos.xAdvance - pos.advanceWidth) !== 0) {
          addSegment(i + 1);
        }
      }

      x += pos.xAdvance * scale;
    }

    // Flush any remaining commands
    flush(i);

    // end the text object
    this.addContent("ET");

    // restore flipped coordinate system
    return this.restore();
  }
};
