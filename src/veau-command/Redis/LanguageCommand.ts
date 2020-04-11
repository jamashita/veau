import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { JSONA } from '../../veau-general/JSONA';
import { IRedis } from '../../veau-general/Redis/interfaces/IRedis';
import { RedisError } from '../../veau-general/Redis/RedisError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { REDIS_LANGUAGE_KEY } from '../../veau-infrastructure/VeauRedis';
import { Languages } from '../../veau-vo/Languages';
import { ILanguageCommand } from '../Interfaces/ILanguageCommand';
import { IRedisCommand } from '../Interfaces/IRedisCommand';

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

      return Success.of<void, DataSourceError>(undefined);
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<void, RedisError>(err);
      }

      throw err;
    }
  }

  public async deleteAll(): Promise<Try<void, CacheError | DataSourceError>> {
    try {
      const ok: boolean = await this.redis.delete(REDIS_LANGUAGE_KEY);

      if (ok) {
        return Success.of<void, DataSourceError>(undefined);
      }

      return Failure.of<void, CacheError>(new CacheError('FAIL TO DELETE CACHE'));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<void, RedisError>(err);
      }

      throw err;
    }
  }
}
