import IORedis from 'ioredis';

export class RedisList {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public push(key: string, value: string): unknown {
    return this.client.rpush(key, value);
  }

  public pop(key: string): Promise<string> {
    return this.client.rpop(key);
  }

  public shift(key: string): Promise<string> {
    return this.client.lpop(key);
  }

  public length(key: string): Promise<number> {
    return this.client.llen(key);
  }

  public remove(key: string, value: string): Promise<number> {
    return this.client.lrem(key, 0, value);
  }

  public select(key: string, offset: number, limit: number): Promise<unknown> {
    const start: number = offset;
    const stop: number = offset + limit;

    return this.client.lrange(key, start, stop);
  }

  public dump(key: string): Promise<unknown> {
    return this.client.lrange(key, 0, -1);
  }
}
