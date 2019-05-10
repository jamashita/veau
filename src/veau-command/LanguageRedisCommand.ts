import { Language, LanguageJSON } from '../veau-entity/Language';
import { CacheError } from '../veau-error/CacheError';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ILanguageCommand } from './interfaces/ILanguageCommand';

const REDIS_KEY: string = 'Languages';
const DURATION: number = 3 * 60 * 60;

export class LanguageRedisCommand implements ILanguageCommand {
  private static instance: LanguageRedisCommand = new LanguageRedisCommand();

  public static getInstance(): LanguageRedisCommand {
    return LanguageRedisCommand.instance;
  }

  private constructor() {
  }

  public async insertAll(languages: Array<Language>): Promise<any> {
    const languageJSONs: Array<LanguageJSON> = languages.map<LanguageJSON>((language: Language) => {
      return language.toJSON();
    });

    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(languageJSONs));

    return VeauRedis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<any> {
    const ok: boolean = await VeauRedis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
