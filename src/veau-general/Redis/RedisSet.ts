import IORedis from 'ioredis';

export class RedisSet {
  private client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public add(key: string, value: string): any {
    return this.client.sadd(key, value);
  }

  public remove(key: string, value: string): any {
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

  public dump(key: string): Promise<any> {
    return this.client.smembers(key);
  }

  public random(key: string): Promise<any> {
    return this.client.srandmember(key);
  }

  public pop(key: string): Promise<any> {
    return this.client.spop(key);
  }
}
