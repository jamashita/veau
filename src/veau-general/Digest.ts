import * as bcrypt from 'bcrypt';
import * as md5 from 'md5';

const ROUNDS = 14;

export type DigestResponseJSON = {
  salt: string;
  hash: string;
};

export class Digest {

  public static generate(str: string): Promise<DigestResponseJSON> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(ROUNDS, (err: Error, salt: string) => {
        if (err) {
          reject(err);
          return;
        }

        bcrypt.hash(str, salt, (err: Error, hash: string) => {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            salt,
            hash
          });
        });
      });
    });
  }

  public static compare(str: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(str, hash, (err: Error, res: boolean) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  public static md5(buffer: string | Buffer): string {
    return md5(buffer);
  }
}
