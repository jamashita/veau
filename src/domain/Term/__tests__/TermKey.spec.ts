import { TermKey } from '../TermKey';

describe('TermKey', () => {
  describe('of', () => {
    it('normal case', () => {
      const key1: string = 'key 1';
      const key2: string = 'key 2';
      const key3: string = 'key 3';

      expect(TermKey.of(key1).get()).toBe(key1);
      expect(TermKey.of(key2).get()).toBe(key2);
      expect(TermKey.of(key3).get()).toBe(key3);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const key: TermKey = TermKey.of('key');

      expect(key.equals(null)).toBe(false);
      expect(key.equals(undefined)).toBe(false);
      expect(key.equals('')).toBe(false);
      expect(key.equals('123')).toBe(false);
      expect(key.equals('abcd')).toBe(false);
      expect(key.equals(123)).toBe(false);
      expect(key.equals(0)).toBe(false);
      expect(key.equals(-12)).toBe(false);
      expect(key.equals(0.3)).toBe(false);
      expect(key.equals(false)).toBe(false);
      expect(key.equals(true)).toBe(false);
      expect(key.equals(Symbol('p'))).toBe(false);
      expect(key.equals(20n)).toBe(false);
      expect(key.equals({})).toBe(false);
      expect(key.equals([])).toBe(false);
      expect(key.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      const key1: TermKey = TermKey.of('key 1');
      const key2: TermKey = TermKey.of('key 2');
      const key3: TermKey = TermKey.of('key 1');

      expect(key1.equals(key1)).toBe(true);
      expect(key1.equals(key2)).toBe(false);
      expect(key1.equals(key3)).toBe(true);
    });
  });
});
