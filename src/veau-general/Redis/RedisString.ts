import * as IORedis from 'ioredis';

export class RedisString {
  private client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public set(key: string, value: string): Promise<string> {
    return this.client.set(key, value);
  }

  public get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
