import IORedis from 'ioredis';

export class RedisSet {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public add(key: string, value: string): unknown {
    return this.client.sadd(key, value);
  }

  public remove(key: string, value: string): unknown {
    return this.client.srem(key, value);
  }

  public async has(key: string, value: string): Promise<boolean> {
    const result: 0 | 1 = await this.client.sismember(key, value);

    if (result === 0) {
      return false;
    }

    return true;
  }

  public length(key: string): Promise<number> {
    return this.client.scard(key);
  }

  public dump(key: string): Promise<unknown> {
    return this.client.smembers(key);
  }

  public random(key: string): Promise<unknown> {
    return this.client.srandmember(key);
  }

  public pop(key: string): Promise<unknown> {
    return this.client.spop(key);
  }
}
