import 'jest';
import { Color } from '../Color';

describe('Color', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const color1: Color = Color.of('#ffffff');
      const color2: Color = Color.of('#fcfcfc');
      const color3: Color = Color.of('#ffffff');

      expect(color1.equals(color1)).toEqual(true);
      expect(color1.equals(color2)).toEqual(false);
      expect(color1.equals(color3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const rgb: string = '#ffffff';
      const color: Color = Color.of(rgb);

      expect(color.toString()).toEqual(rgb);
    });
  });
});
