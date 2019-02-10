import * as IORedis from 'ioredis';

export class RedisList {
  private client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public push(key: string, value: string): any {
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

  public dump(key: string): Promise<any> {
    return this.client.lrange(key, 0, -1);
  }
}
