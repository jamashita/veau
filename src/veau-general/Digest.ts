import * as bcrypt from 'bcrypt';
import * as md5 from 'md5';

const ROUNDS: number = 14;

export type DigestResponseJSON = {
  salt: string;
  hash: string;
};

export class Digest {

  public static generate(str: string): Promise<DigestResponseJSON> {
    return new Promise<DigestResponseJSON>((resolve: (value: DigestResponseJSON) => void, reject: (reason: any) => void): void => {
      bcrypt.genSalt(ROUNDS, (err1: Error, salt: string): void => {
        if (err1) {
          reject(err1);
          return;
        }

        bcrypt.hash(str, salt, (err2: Error, hash: string): void => {
          if (err2) {
            reject(err2);
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
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      bcrypt.compare(str, hash, (err: Error, res: boolean): void => {
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
