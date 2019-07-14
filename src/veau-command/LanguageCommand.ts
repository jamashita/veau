import { Languages } from '../veau-entity/collection/Languages';
import { CacheError } from '../veau-error/CacheError';
import { veauRedis } from '../veau-infrastructure/VeauRedis';

const REDIS_KEY: string = 'Languages';
const DURATION: number = 3 * 60 * 60;

export class LanguageCommand {
  private static instance: LanguageCommand = new LanguageCommand();

  public static getInstance(): LanguageCommand {
    return LanguageCommand.instance;
  }

  private constructor() {
  }

  public async insertAll(languages: Languages): Promise<any> {
    await veauRedis.getString().set(REDIS_KEY, JSON.stringify(languages.toJSON()));

    return veauRedis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<any> {
    const ok: boolean = await veauRedis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
