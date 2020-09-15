import { Color } from '../Color';

describe('Color', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      expect.assertions(3);

      const color1: Color = Color.of('#ffffff');
      const color2: Color = Color.of('#fcfcfc');
      const color3: Color = Color.of('#ffffff');

      expect(color1.equals(color1)).toBe(true);
      expect(color1.equals(color2)).toBe(false);
      expect(color1.equals(color3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const rgb: string = '#ffffff';
      const color: Color = Color.of(rgb);

      expect(color.toString()).toBe(rgb);
    });
  });
});
