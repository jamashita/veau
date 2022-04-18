import { HeaderSize } from '../HeaderSize';
import { HeaderSizeError } from '../HeaderSizeError';

describe('HeaderSize', () => {
  describe('of', () => {
    it('returns Dead when the argument is less than 0', () => {
      expect(() => {
        HeaderSize.of(-1);
      }).toThrow(HeaderSizeError);
      expect(() => {
        HeaderSize.of(-2);
      }).toThrow(HeaderSizeError);
    });

    it('returns Dead when the argument is not integer', () => {
      expect(() => {
        HeaderSize.of(0.1);
      }).toThrow(HeaderSizeError);
      expect(() => {
        HeaderSize.of(1.5);
      }).toThrow(HeaderSizeError);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const size1: HeaderSize = HeaderSize.ofString('');
      const size2: HeaderSize = HeaderSize.ofString('1');

      expect(size1.get()).toBe(0);
      expect(size2.get()).toBe(14);
    });
  });

  describe('default', () => {
    it('normal case', () => {
      const size: HeaderSize = HeaderSize.default();

      expect(size.get()).toBe(14);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const size: HeaderSize = HeaderSize.default();

      expect(size.equals(null)).toBe(false);
      expect(size.equals(undefined)).toBe(false);
      expect(size.equals('')).toBe(false);
      expect(size.equals('123')).toBe(false);
      expect(size.equals('abcd')).toBe(false);
      expect(size.equals(123)).toBe(false);
      expect(size.equals(0)).toBe(false);
      expect(size.equals(-12)).toBe(false);
      expect(size.equals(0.3)).toBe(false);
      expect(size.equals(false)).toBe(false);
      expect(size.equals(true)).toBe(false);
      expect(size.equals(Symbol('p'))).toBe(false);
      expect(size.equals(20n)).toBe(false);
      expect(size.equals({})).toBe(false);
      expect(size.equals([])).toBe(false);
      expect(size.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      const size1: HeaderSize = HeaderSize.of(10);
      const size2: HeaderSize = HeaderSize.of(20);
      const size3: HeaderSize = HeaderSize.of(10);

      expect(size1.equals(size1)).toBe(true);
      expect(size1.equals(size2)).toBe(false);
      expect(size1.equals(size3)).toBe(true);
    });
  });
});
