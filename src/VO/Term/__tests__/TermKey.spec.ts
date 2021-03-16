import { TermKey } from '../TermKey';

describe('TermKey', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(3);

      const key1: string = 'key 1';
      const key2: string = 'key 2';
      const key3: string = 'key 3';

      expect(TermKey.of(key1).get()).toBe(key1);
      expect(TermKey.of(key2).get()).toBe(key2);
      expect(TermKey.of(key3).get()).toBe(key3);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const key1: TermKey = TermKey.of('key 1');
      const key2: TermKey = TermKey.of('key 2');
      const key3: TermKey = TermKey.of('key 1');

      expect(key1.equals(key1)).toBe(true);
      expect(key1.equals(key2)).toBe(false);
      expect(key1.equals(key3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const name: string = 'hash';
      const key: TermKey = TermKey.of(name);

      expect(key.toString()).toBe(name);
    });
  });
});
