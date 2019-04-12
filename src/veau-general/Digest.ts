import * as bcrypt from 'bcrypt';

const ROUNDS: number = 14;

export class Digest {

  public static async generate(str: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(ROUNDS);
    const hash: string = await bcrypt.hash(str, salt);

    return hash;
  }

  public static compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
