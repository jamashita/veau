import { Digest } from '../Digest';

describe('Digest', () => {
  describe('generate', () => {
    it('generated hashes are usually different', async () => {
      const password: string = 'The quick brown fox jumps over the lazy dog';
      const [
        hash1,
        hash2
      ]: [
        string,
        string
      ] = await Promise.all([
        Digest.generate(password),
        Digest.generate(password)
      ]);

      expect(hash1).not.toBe(hash2);
    }, 30000);
  });

  describe('compare', () => {
    it('even if the hashes are different, compare returns true', async () => {
      const password: string = 'The quick brown fox jumps over the lazy dog';
      const hash1: string = await Digest.generate(password);
      const hash2: string = await Digest.generate(password);

      const [
        compared1,
        compared2
      ]: [
        boolean,
        boolean
      ] = await Promise.all([
        Digest.compare(password, hash1),
        Digest.compare(password, hash2)
      ]);

      expect(compared1).toBe(true);
      expect(compared2).toBe(true);
    }, 30000);
  });
});
