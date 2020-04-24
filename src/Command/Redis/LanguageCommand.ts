import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, IRedis, JSONA, RedisError, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { REDIS_LANGUAGE_KEY } from '../../Infrastructure/VeauRedis';
import { Languages } from '../../VO/Languages';
import { ILanguageCommand } from '../Interface/ILanguageCommand';
import { IRedisCommand } from '../Interface/IRedisCommand';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class LanguageCommand implements ILanguageCommand, IRedisCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(TYPE.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async insertAll(languages: Languages): Promise<Superposition<void, DataSourceError>> {
    try {
      const str: string = await JSONA.stringify(languages.toJSON());
      await this.redis.getString().set(REDIS_LANGUAGE_KEY, str);
      await this.redis.expires(REDIS_LANGUAGE_KEY, DURATION);

      return Alive.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Dead.of<RedisError>(err);
      }

      throw err;
    }
  }

  public async deleteAll(): Promise<Superposition<void, DataSourceError>> {
    try {
      const ok: boolean = await this.redis.delete(REDIS_LANGUAGE_KEY);

      if (ok) {
        return Alive.of<DataSourceError>();
      }

      return Dead.of<RedisError>(new RedisError('FAIL TO DELETE CACHE'));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Dead.of<RedisError>(err);
      }

      throw err;
    }
  }
}
