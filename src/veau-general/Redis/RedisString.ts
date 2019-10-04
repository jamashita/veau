import IORedis from 'ioredis';

export class RedisString {
  private client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async set(key: string, value: string): Promise<boolean> {
    const result: string = await this.client.set(key, value);

    if (result === 'OK') {
      return true;
    }

    return false;
  }

  public get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
