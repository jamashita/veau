import * as IORedis from 'ioredis';

export class RedisHash {
  private client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public set(key: string, field: string, value: string): Promise<boolean> {
    return this.client.hset(key, field, value).then((result: 0 | 1) => {
      if (result === 0) {
        return false;
      }

      return true;
    });
  }

  public get(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  public delete(key: string, field: string): any {
    return this.client.hdel(key, field);
  }

  public length(key: string): Promise<number> {
    return this.client.hlen(key);
  }

  public has(key: string, field: string): Promise<boolean> {
    return this.client.hexists(key, field).then((result: 0 | 1) => {
      if (result === 0) {
        return false;
      }

      return true;
    });
  }
}
