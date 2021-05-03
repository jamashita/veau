import { UnimplementedError } from '@jamashita/anden-error';
import { Nullable } from '@jamashita/anden-type';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language, LanguageJSON } from '../../../domain/vo/Language/Language';
import { LanguageID } from '../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../domain/vo/Language/Languages';
import { REDIS_LANGUAGE_KEY } from '../../../infrastructure/VeauRedis';
import { LanguageQueryFindByISO639 } from '../abstract/LanguageQueryFindByISO639';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { IRedisQuery } from './IRedisQuery';

@injectable()
export class LanguageRedisQuery implements ILanguageQuery<RedisError>, IRedisQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    throw new UnimplementedError();
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    return LanguageQueryFindByISO639.of<RedisError>(this.all()).findByISO639(iso639);
  }
}
