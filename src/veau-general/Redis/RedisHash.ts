import * as redis from 'redis';

export class RedisHash {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public set(key: string, field: string, value: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.hset(key, field, value, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        if (response === 1) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }

  public get(key: string, field: string): Promise<string> {
    return new Promise<string>((resolve: (value: string) => void, reject: (reason: any) => void): void => {
      this.client.hget(key, field, (err: Error | null, response: string): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public delete(key: string, field: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.hdel(key, field, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        if (response === 1) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }

  public length(key: string): Promise<number> {
    return new Promise<number>((resolve: (value: number) => void, reject: (reason: any) => void): void => {
      this.client.hlen(key, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public has(key: string, field: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.hexists(key, field, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        if (response === 1) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }
}
