import { Color } from '../Color';

describe('Color', () => {
  describe('equals', () => {
    it('returns false if others given', () => {
      const color: Color = Color.of('#f0f0f0');

      expect(color.equals(null)).toBe(false);
      expect(color.equals(undefined)).toBe(false);
      expect(color.equals('')).toBe(false);
      expect(color.equals('123')).toBe(false);
      expect(color.equals('abcd')).toBe(false);
      expect(color.equals(123)).toBe(false);
      expect(color.equals(0)).toBe(false);
      expect(color.equals(-12)).toBe(false);
      expect(color.equals(0.3)).toBe(false);
      expect(color.equals(false)).toBe(false);
      expect(color.equals(true)).toBe(false);
      expect(color.equals(Symbol('p'))).toBe(false);
      expect(color.equals(20n)).toBe(false);
      expect(color.equals({})).toBe(false);
      expect(color.equals([])).toBe(false);
      expect(color.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      const color1: Color = Color.of('#ffffff');
      const color2: Color = Color.of('#fcfcfc');
      const color3: Color = Color.of('#ffffff');

      expect(color1.equals(color1)).toBe(true);
      expect(color1.equals(color2)).toBe(false);
      expect(color1.equals(color3)).toBe(true);
    });
  });
});
