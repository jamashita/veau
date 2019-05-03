import { Language, LanguageJSON } from '../veau-entity/Language';
import { CacheError } from '../veau-error/CacheError';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ILanguageCommand } from './interfaces/ILanguageCommand';

export class LanguageRedisCommand implements ILanguageCommand {
  private static instance: LanguageRedisCommand = new LanguageRedisCommand();
  private static REDIS_KEY: string = 'Languages';
  private static DURATION: number = 10800;

  public static getInstance(): LanguageRedisCommand {
    return LanguageRedisCommand.instance;
  }

  private constructor() {
  }

  public async insertAll(languages: Array<Language>): Promise<any> {
    const languageJSONs: Array<LanguageJSON> = languages.map<LanguageJSON>((language: Language) => {
      return language.toJSON();
    });

    await VeauRedis.getString().set(LanguageRedisCommand.REDIS_KEY, JSON.stringify(languageJSONs));

    return VeauRedis.expires(LanguageRedisCommand.REDIS_KEY, LanguageRedisCommand.DURATION);
  }

  public async deleteAll(): Promise<any> {
    const ok: boolean = await VeauRedis.delete(LanguageRedisCommand.REDIS_KEY);
    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
