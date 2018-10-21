import 'jest';
import {Digest} from '../Digest';

describe('Digest', () => {
  it(`generate(), compare(): Encrypted passwords are different,
  because the salts are not same,
  but the authentications are passed`, async () => {

    const password = 'The quick brown fox jumps over the lazy dog';
    const digest1 = await Digest.generate(password);
    const digest2 = await Digest.generate(password);

    expect(digest1.salt).not.toEqual(digest2.salt);
    expect(digest1.hash).not.toEqual(digest2.hash);

    expect(await Digest.compare(password, digest1.hash)).toEqual(true);
    expect(await Digest.compare(password, digest2.hash)).toEqual(true);
  }, 30000);
});
