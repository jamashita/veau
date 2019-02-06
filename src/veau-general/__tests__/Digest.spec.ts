/* tslint:disable */
import 'jest';
import { Digest, DigestResponseJSON } from '../Digest';

describe('Digest', () => {
  it('generate, compare', async () => {

    const password: string = 'The quick brown fox jumps over the lazy dog';
    const digest1: DigestResponseJSON = await Digest.generate(password);
    const digest2: DigestResponseJSON = await Digest.generate(password);

    expect(digest1.salt).not.toEqual(digest2.salt);
    expect(digest1.hash).not.toEqual(digest2.hash);

    expect(await Digest.compare(password, digest1.hash)).toEqual(true);
    expect(await Digest.compare(password, digest2.hash)).toEqual(true);
  }, 30000);
});
