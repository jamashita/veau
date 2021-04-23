import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { Superposition } from '@jamashita/genitore-superposition';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { REDIS_LANGUAGE_KEY } from '../../Infrastructure/VeauRedis';
import { Languages } from '../../VO/Language/Languages';
import { ILanguageCommand } from '../Interface/ILanguageCommand';
import { IRedisCommand } from './Interface/IRedisCommand';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class LanguageCommand implements ILanguageCommand<RedisError>, IRedisCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public insertAll(languages: Languages): Superposition<unknown, RedisError> {
    return Superposition.playground<string, JSONAError>(() => {
      return JSONA.stringify(languages.toJSON());
    }, JSONAError).transform<unknown, RedisError>(async (str: string) => {
      await this.redis.getString().set(REDIS_LANGUAGE_KEY, str);

      return this.redis.expires(REDIS_LANGUAGE_KEY, DURATION);
    }, (err: JSONAError) => {
      throw new RedisError('LanguageCommand.insertAll()', err);
    }, RedisError);
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
}
