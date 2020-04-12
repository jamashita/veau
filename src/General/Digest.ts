import bcrypt from 'bcrypt';

const ROUNDS: number = 14;

export class Digest {

  public static async generate(str: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(ROUNDS);

    return bcrypt.hash(str, salt);
  }

  public static compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }

  private constructor() {
  }
}
