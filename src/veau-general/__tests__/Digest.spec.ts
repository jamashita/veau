/* tslint:disable */
import 'jest';
import { Digest } from '../Digest';

describe('Digest', () => {
  it('generate, compare', async () => {

    const password: string = 'The quick brown fox jumps over the lazy dog';
    const hash1: string = await Digest.generate(password);
    const hash2: string = await Digest.generate(password);

    expect(hash1).not.toEqual(hash2);

    expect(await Digest.compare(password, hash1)).toEqual(true);
    expect(await Digest.compare(password, hash2)).toEqual(true);
  }, 30000);
});
