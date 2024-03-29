import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Superposition } from '@jamashita/genitore-superposition';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Languages } from '../../../domain/vo/Language/Languages.js';
import { REDIS_LANGUAGE_KEY } from '../../../infrastructure/VeauRedis.js';
import { ILanguageCommand } from '../ILanguageCommand.js';
import { IRedisCommand } from './IRedisCommand.js';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class LanguageRedisCommand implements ILanguageCommand<RedisError>, IRedisCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public deleteAll(): Superposition<unknown, RedisError> {
    return Superposition.playground<boolean, RedisError>(() => {
      return this.redis.delete(REDIS_LANGUAGE_KEY);
    }, RedisError).map<unknown, RedisError>((ok: boolean) => {
      if (ok) {
        return null;
      }

      throw new RedisError('FAIL TO DELETE CACHE');
    });
  }

  public insertAll(languages: Languages): Superposition<unknown, RedisError> {
    return Superposition.playground<string, JSONAError>(() => {
      return JSONA.stringify(languages.toJSON());
    }, JSONAError).transform<unknown, RedisError>(async (str: string) => {
      await this.redis.getString().set(REDIS_LANGUAGE_KEY, str);

      return this.redis.expires(REDIS_LANGUAGE_KEY, DURATION);
    }, (err: JSONAError) => {
      throw new RedisError('LanguageRedisCommand.insertAll()', err);
    }, RedisError);
  }
}
