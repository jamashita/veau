import { CacheError } from '../veau-error/CacheError';
import { veauRedis } from '../veau-infrastructure/VeauRedis';
import { Languages } from '../veau-vo/collection/Languages';

const REDIS_KEY: string = 'LANGUAGES';
const DURATION: number = 3 * 60 * 60;

export class LanguageCommand {
  private static instance: LanguageCommand = new LanguageCommand();

  public static getInstance(): LanguageCommand {
    return LanguageCommand.instance;
  }

  private constructor() {
  }

  public async insertAll(languages: Languages): Promise<unknown> {
    await veauRedis.getString().set(REDIS_KEY, JSON.stringify(languages.toJSON()));

    return veauRedis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<void> {
    const ok: boolean = await veauRedis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
