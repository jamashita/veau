import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { DataSourceError } from '../../General/DataSourceError';
import { JSONA } from '../../General/JSONA';
import { IRedis } from '../../General/Redis/Interface/IRedis';
import { RedisError } from '../../General/Redis/RedisError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
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

  public async insertAll(languages: Languages): Promise<Try<void, DataSourceError>> {
    try {
      const str: string = await JSONA.stringify(languages.toJSON());
      await this.redis.getString().set(REDIS_LANGUAGE_KEY, str);
      await this.redis.expires(REDIS_LANGUAGE_KEY, DURATION);

      return Success.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<RedisError>(err);
      }

      throw err;
    }
  }

  public async deleteAll(): Promise<Try<void, DataSourceError>> {
    try {
      const ok: boolean = await this.redis.delete(REDIS_LANGUAGE_KEY);

      if (ok) {
        return Success.of<DataSourceError>();
      }

      return Failure.of<RedisError>(new RedisError('FAIL TO DELETE CACHE'));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<RedisError>(err);
      }

      throw err;
    }
  }
}
