import { Hash } from '../Hash';

describe('Hash', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const hash1: Hash = Hash.of('hash 1');
      const hash2: Hash = Hash.of('hash 2');
      const hash3: Hash = Hash.of('hash 1');

      expect(hash1.equals(hash1)).toBe(true);
      expect(hash1.equals(hash2)).toBe(false);
      expect(hash1.equals(hash3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const hashed: string = 'hash';
      const hash: Hash = Hash.of(hashed);

      expect(hash.toString()).toBe(hashed);
    });
  });
});
