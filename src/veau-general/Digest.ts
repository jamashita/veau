import * as bcrypt from 'bcrypt';

const ROUNDS: number = 14;

export type DigestResponseJSON = {
  salt: string;
  hash: string;
};

export class Digest {

  public static async generate(str: string): Promise<DigestResponseJSON> {
    const salt: string = await bcrypt.genSalt(ROUNDS);
    const hash: string = await bcrypt.hash(str, salt);

    return {
      salt,
      hash
    };
  }

  public static compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
