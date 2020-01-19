import 'jest';
import { Hash } from '../Hash';

describe('Hash', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const hash1: Hash = Hash.of('hash 1');
      const hash2: Hash = Hash.of('hash 2');
      const hash3: Hash = Hash.of('hash 1');

      expect(hash1.equals(hash1)).toEqual(true);
      expect(hash1.equals(hash2)).toEqual(false);
      expect(hash1.equals(hash3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const hashed: string = 'hash';
      const hash: Hash = Hash.of(hashed);

      expect(hash.toString()).toEqual(hashed);
    });
  });
});
