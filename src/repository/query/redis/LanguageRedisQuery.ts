import { Kind, Nullable } from '@jamashita/anden-type';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Superposition } from '@jamashita/genitore-superposition';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError.js';
import { LanguageJSON } from '../../../domain/vo/Language/Language.js';
import { Languages } from '../../../domain/vo/Language/Languages.js';
import { REDIS_LANGUAGE_KEY } from '../../../infrastructure/VeauRedis.js';
import { ALanguageQuery } from '../ALanguageQuery.js';
import { ILanguageQuery } from '../ILanguageQuery.js';
import { IRedisQuery } from './IRedisQuery.js';

@injectable()
export class LanguageRedisQuery extends ALanguageQuery<RedisError, 'Redis'> implements ILanguageQuery<RedisError>, IRedisQuery {
  public override readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    super();
    this.redis = redis;
  }

  public all(): Superposition<Languages, LanguageError | RedisError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_LANGUAGE_KEY);
    }, RedisError).map<Array<LanguageJSON>, RedisError>((str: Nullable<string>) => {
      if (Kind.isNull(str)) {
        throw new RedisError('LanguageBinQuery.all()');
      }

      return JSONA.parse<Array<LanguageJSON>>(str);
    }).map<Languages, LanguageError>((json: Array<LanguageJSON>) => {
      return Languages.ofJSON(json);
    }, LanguageError).recover<Languages, LanguageError | RedisError>((err: JSONAError | LanguageError | RedisError) => {
      if (err instanceof JSONAError) {
        throw new LanguageError('LanguageBinQuery.all()', err);
      }

      throw err;
    }, LanguageError, RedisError);
  }
}
