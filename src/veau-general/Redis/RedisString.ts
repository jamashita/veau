import * as redis from 'redis';

export class RedisString {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public set(key: string, value: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.set(key, value, (err: Error | null, response: 'OK' | null): void => {
        if (err) {
          reject(err);
          return;
        }

        if (response === 'OK') {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }

  public get(key: string): Promise<string | null> {
    return new Promise<string | null>((resolve: (value: string | null) => void, reject: (reason: any) => void): void => {
      this.client.get(key, (err: Error | null, response: string | null): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}
