import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { JSONA } from '../../veau-general/JSONA';
import { Redis } from '../../veau-general/Redis/Redis';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Languages } from '../../veau-vo/Languages';
import { ILanguageCommand } from '../interfaces/ILanguageCommand';
import { IRedisCommand } from '../interfaces/IRedisCommand';

const REDIS_KEY: string = 'LANGUAGES';
const DURATION: number = 3 * 60 * 60;

@injectable()
export class LanguageCommand implements ILanguageCommand, IRedisCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: Redis;

  public constructor(@inject(TYPE.Redis) redis: Redis) {
    this.redis = redis;
  }

  public async insertAll(languages: Languages): Promise<unknown> {
    const str: string = await JSONA.stringify(languages.toJSON());
    await this.redis.getString().set(REDIS_KEY, str);

    return this.redis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<Try<void, CacheError>> {
    const ok: boolean = await this.redis.delete(REDIS_KEY);

    if (ok) {
      return Success.of<void, CacheError>(undefined);
    }

    return Failure.of<void, CacheError>(new CacheError('FAIL TO DELETE CACHE'));
  }
}