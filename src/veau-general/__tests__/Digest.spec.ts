import 'jest';
import { Digest } from '../Digest';

describe('Digest', () => {
  describe('generate', () => {
    it('generated hashes are usually different', async () => {
      const password: string = 'The quick brown fox jumps over the lazy dog';
      const hash1: string = await Digest.generate(password);
      const hash2: string = await Digest.generate(password);

      expect(hash1).not.toEqual(hash2);
    }, 30000);
  });

  describe('compare', () => {
    it('even if the hashes are different, compare returns true', async () => {
      const password: string = 'The quick brown fox jumps over the lazy dog';
      const hash1: string = await Digest.generate(password);
      const hash2: string = await Digest.generate(password);

      expect(await Digest.compare(password, hash1)).toEqual(true);
      expect(await Digest.compare(password, hash2)).toEqual(true);
    }, 30000);
  });
});
