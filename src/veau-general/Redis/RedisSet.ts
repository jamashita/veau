import * as redis from 'redis';

export class RedisSet {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public add(key: string, value: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.sadd(key, value, (err: Error | null, response: number): void => {
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

  public remove(key: string, value: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.srem(key, value, (err: Error | null, response: number): void => {
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

  public has(key: string, value: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.sismember(key, value, (err: Error | null, response: number): void => {
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
      this.client.scard(key, (err: Error | null, response: number): void => {
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
      this.client.smembers(key, (err: Error | null, response: Array<string>): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public random(key: string): Promise<string | null> {
    return new Promise<string | null>((resolve: (value: string | null) => void, reject: (reason: any) => void): void => {
      this.client.srandmember(key, (err: Error | null, response: string | null): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public pop(key: string): Promise<string | null> {
    return new Promise<string | null>((resolve: (value: string | null) => void, reject: (reason: any) => void): void => {
      this.client.spop(key, (err: Error | null, response: string | null): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}
