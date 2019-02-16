import * as IORedis from 'ioredis';

export class RedisString {
  private client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public set(key: string, value: string): Promise<boolean> {
    return this.client.set(key, value).then((result: string) => {
      if (result === 'OK') {
        return true;
      }

      return false;
    });
  }

  public get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
