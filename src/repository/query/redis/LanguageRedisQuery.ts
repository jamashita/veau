import { Nullable } from '@jamashita/anden-type';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { Inject, Injectable } from '@nestjs/common';
import { Type } from '../../../container/Types';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { LanguageJSON } from '../../../domain/vo/Language/Language';
import { Languages } from '../../../domain/vo/Language/Languages';
import { REDIS_LANGUAGE_KEY } from '../../../infrastructure/VeauRedis';
import { ALanguageQuery } from '../abstract/ALanguageQuery';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { IRedisQuery } from './IRedisQuery';

@Injectable()
export class LanguageRedisQuery extends ALanguageQuery<RedisError, 'Redis'> implements ILanguageQuery<RedisError>, IRedisQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@Inject(Type.Redis) redis: IRedis) {
    super();
    this.redis = redis;
  }

  public all(): Superposition<Languages, LanguageError | RedisError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_LANGUAGE_KEY);
    }, RedisError).map<string, UnscharferelationError>((str: Nullable<string>) => {
      return Unscharferelation.maybe<string>(str).toSuperposition();
    }).map<Array<LanguageJSON>, JSONAError>((j: string) => {
      return JSONA.parse<Array<LanguageJSON>>(j);
    }, JSONAError).map<Languages, LanguageError>((json: Array<LanguageJSON>) => {
      return Languages.ofJSON(json);
    }, LanguageError).recover<Languages, LanguageError | RedisError>((err: JSONAError | LanguageError | RedisError | UnscharferelationError) => {
      if (err instanceof JSONAError) {
        throw new LanguageError('LanguageBinQuery.all()', err);
      }
      if (err instanceof UnscharferelationError) {
        throw new RedisError('LanguageBinQuery.all()', err);
      }

      throw err;
    }, LanguageError, RedisError);
  }
}
