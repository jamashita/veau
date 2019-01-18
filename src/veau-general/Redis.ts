import * as redis from 'redis';

class RedisHash {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public set(key: string, field: string, value: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.hset(key, field, value, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public get(key: string, field: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.hget(key, field, (err: Error | null, response: string) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public delete(key: string, field: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.hdel(key, field, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public length(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.hlen(key, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public has(key: string, field: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.hexists(key, field, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        if (response > 0) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }
}

class RedisSet {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public add(key: string, value: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.sadd(key, value, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public remove(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.srem(key, value, (err: Error | null, response: number) => {
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
    return new Promise((resolve, reject) => {
      this.client.sismember(key, value, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        if (response > 0) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }

  public length(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.scard(key, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public dump(key: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.client.smembers(key, (err: Error | null, response: Array<string>) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public random(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.srandmember(key, (err: Error | null, response: string) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public pop(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.spop(key, (err: Error | null, response: string) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}

class RedisList {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public push(key: string, value: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.rpush(key, value, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public pop(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.rpop(key, (err: Error | null, response: string) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public shift(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.lpop(key, (err: Error | null, response: string) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public length(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.llen(key, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public dump(key: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.client.lrange(key, 0, -1, (err: Error | null, response: Array<string>) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}

class RedisString {
  private client: redis.RedisClient;

  public constructor(client: redis.RedisClient) {
    this.client = client;
  }

  public set(key: string, value: string): Promise<'OK'> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (err: Error | null, response: 'OK') => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err: Error | null, response: string) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}

export class Redis {
  private hash: RedisHash;
  private set: RedisSet;
  private list: RedisList;
  private string: RedisString;
  private client: redis.RedisClient;

  public constructor(config: redis.ClientOpts) {
    const client = redis.createClient(config);

    client.on('error', (err) => {
      console.log('REDIS ERROR');
      console.log(err);
    });

    this.hash = new RedisHash(client);
    this.set = new RedisSet(client);
    this.list = new RedisList(client);
    this.string = new RedisString(client);

    this.client = client;
  }

  public getHash(): RedisHash {
    return this.hash;
  }

  public getSet(): RedisSet {
    return this.set;
  }

  public getList(): RedisList {
    return this.list;
  }

  public getString(): RedisString {
    return this.string;
  }

  public delete(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  public exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.exists(key, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }
        if (response === 0) {
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  public expires(key: string, seconds: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.expire(key, seconds, (err: Error | null, response: number) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}
