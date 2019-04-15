import * as bcrypt from 'bcrypt';

export class Digest {
  private static ROUNDS: number = 14;

  public static async generate(str: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(Digest.ROUNDS);

    return bcrypt.hash(str, salt);
  }

  public static compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
