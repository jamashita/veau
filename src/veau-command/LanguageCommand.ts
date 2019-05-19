import { Language, LanguageJSON } from '../veau-entity/Language';
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

  public async insertAll(languages: Array<Language>): Promise<any> {
    const languageJSONs: Array<LanguageJSON> = languages.map<LanguageJSON>((language: Language) => {
      return language.toJSON();
    });

    await veauRedis.getString().set(REDIS_KEY, JSON.stringify(languageJSONs));

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
