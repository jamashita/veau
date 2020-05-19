import { inject, injectable } from 'inversify';
import {
  Alive,
  DataSourceError,
  Dead,
  IRedis,
  JSONA,
  JSONAError,
  RedisError,
  Schrodinger,
  Superposition
} from 'publikum';

import { TYPE } from '../../Container/Types';
import { REDIS_LANGUAGE_KEY } from '../../Infrastructure/VeauRedis';
import { Languages } from '../../VO/Language/Languages';
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

  public async insertAll(languages: Languages): Promise<Superposition<unknown, DataSourceError>> {
    const superposition: Superposition<string, JSONAError> = await Schrodinger.playground<string, JSONAError>(() => {
      return JSONA.stringify(languages.toJSON());
    });

    return superposition.match<unknown, RedisError>(
      (str: string) => {
        return Schrodinger.playground<unknown, RedisError>(async () => {
          await this.redis.getString().set(REDIS_LANGUAGE_KEY, str);
          return this.redis.expires(REDIS_LANGUAGE_KEY, DURATION);
        });
      },
      (err: JSONAError) => {
        return Dead.of<RedisError>(new RedisError('LanguageCommand.insertAll()', err));
      }
    );
  }

  public async deleteAll(): Promise<Superposition<unknown, DataSourceError>> {
    const superposition: Superposition<boolean, RedisError> = await Schrodinger.playground<boolean, RedisError>(() => {
      return this.redis.delete(REDIS_LANGUAGE_KEY);
    });

    return superposition.match<unknown, RedisError>(
      (ok: boolean) => {
        if (ok) {
          return Alive.of<RedisError>();
        }

        return Dead.of<RedisError>(new RedisError('FAIL TO DELETE CACHE'));
      },
      (err: RedisError) => {
        return Dead.of<RedisError>(err);
      }
    );
  }
}
