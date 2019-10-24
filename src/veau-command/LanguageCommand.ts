import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { CacheError } from '../veau-error/CacheError';
import { Redis } from '../veau-general/Redis/Redis';
import { Languages } from '../veau-vo/Languages';

const REDIS_KEY: string = 'LANGUAGES';
const DURATION: number = 3 * 60 * 60;

@injectable()
export class LanguageCommand {
  private redis: Redis;

  public constructor(
    @inject(TYPE.Redis) redis: Redis
  ) {
    this.redis = redis;
  }

  public async insertAll(languages: Languages): Promise<unknown> {
    await this.redis.getString().set(REDIS_KEY, JSON.stringify(languages.toJSON()));

    return this.redis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<void> {
    const ok: boolean = await this.redis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
