import * as bcrypt from 'bcrypt';
import * as md5 from 'md5';

// might take 2 ~ 4 seconds for each request
const rounds = 14;

export type DigestReponseJSON = {
  salt: string,
  hash: string
};

export class Digest {

  public static generate(plainPassword: string): Promise<DigestReponseJSON> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(rounds, (err: Error, salt: string) => {
        if (err) {
          reject(err);
          return;
        }

        bcrypt.hash(plainPassword, salt, (err: Error, hash: string) => {
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

  public static compare(plainPassword: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hash, (err: Error, res: boolean) => {
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
