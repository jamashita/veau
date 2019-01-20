import * as redis from 'redis';

export class RedisList {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public push(key: string, value: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.rpush(key, value, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        if (response > 0) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }

  public pop(key: string): Promise<string | null> {
    return new Promise<string | null>((resolve: (value: string | null) => void, reject: (reason: any) => void): void => {
      this.client.rpop(key, (err: Error | null, response: string | null): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public shift(key: string): Promise<string | null> {
    return new Promise<string | null>((resolve: (value: string | null) => void, reject: (reason: any) => void): void => {
      this.client.lpop(key, (err: Error | null, response: string | null): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public length(key: string): Promise<number> {
    return new Promise<number>((resolve: (value: number) => void, reject: (reason: any) => void): void => {
      this.client.llen(key, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public dump(key: string): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve: (value: Array<string>) => void, reject: (reason: any) => void): void => {
      this.client.lrange(key, 0, -1, (err: Error | null, response: Array<string>): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}
