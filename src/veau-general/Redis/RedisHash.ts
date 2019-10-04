import IORedis from 'ioredis';

export class RedisHash {
  private client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async set(key: string, field: string, value: string): Promise<boolean> {
    const result: 0 | 1 = await this.client.hset(key, field, value);

    if (result === 0) {
      return false;
    }

    return true;
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

  public async has(key: string, field: string): Promise<boolean> {
    const result: 0 | 1 = await this.client.hexists(key, field);

    if (result === 0) {
      return false;
    }

    return true;
  }
}
