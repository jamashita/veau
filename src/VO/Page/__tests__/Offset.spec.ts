import { PageError } from '../Error/PageError';
import { Offset } from '../Offset';

describe('Offset', () => {
  describe('of', () => {
    it('returns Dead when the argument is less than 0', () => {
      expect.assertions(2);

      expect(() => {
        Offset.of(-1);
      }).toThrow(PageError);
      expect(() => {
        Offset.of(-2);
      }).toThrow(PageError);
    });

    it('returns Dead when the argument is not integer', () => {
      expect.assertions(2);

      expect(() => {
        Offset.of(0.1);
      }).toThrow(PageError);
      expect(() => {
        Offset.of(1.5);
      }).toThrow(PageError);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const offset: Offset = Offset.of(1);

      expect(offset.equals(null)).toBe(false);
      expect(offset.equals(undefined)).toBe(false);
      expect(offset.equals('')).toBe(false);
      expect(offset.equals('123')).toBe(false);
      expect(offset.equals('abcd')).toBe(false);
      expect(offset.equals(123)).toBe(false);
      expect(offset.equals(0)).toBe(false);
      expect(offset.equals(-12)).toBe(false);
      expect(offset.equals(0.3)).toBe(false);
      expect(offset.equals(false)).toBe(false);
      expect(offset.equals(true)).toBe(false);
      expect(offset.equals(Symbol('p'))).toBe(false);
      expect(offset.equals(20n)).toBe(false);
      expect(offset.equals({})).toBe(false);
      expect(offset.equals([])).toBe(false);
      expect(offset.equals(Object.create(null))).toBe(false);
    });

    it('returns true i f both properties are the same', () => {
      expect.assertions(3);

      const offset1: Offset = Offset.of(1);
      const offset2: Offset = Offset.of(2);
      const offset3: Offset = Offset.of(1);

      expect(offset1.equals(offset1)).toBe(true);
      expect(offset1.equals(offset2)).toBe(false);
      expect(offset1.equals(offset3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const num: number = 2;
      const offset: Offset = Offset.of(num);

      expect(offset.toString()).toBe(num.toString());
    });
  });
});
