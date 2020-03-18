import { Reject } from './Type/Reject';
import { Resolve } from './Type/Resolve';

export class JSONA {

  public static parse<T>(text: string): Promise<T> {
    return new Promise<T>((resolve: Resolve<T>, reject: Reject): void => {
      setTimeout((): void => {
        try {
          resolve(JSON.parse(text));
        }
        catch (err) {
          reject(err);
        }
      }, 0);
    });
  }

  public static stringify(value: object): Promise<string> {
    return new Promise<string>((resolve: Resolve<string>, reject: Reject): void => {
      setTimeout((): void => {
        try {
          resolve(JSON.stringify(value));
        }
        catch (err) {
          reject(err);
        }
      }, 0);
    });
  }

  private constructor() {
  }
}
