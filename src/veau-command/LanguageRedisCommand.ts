import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { ILanguageCommand } from './interfaces/ILanguageCommand';

export class LanguageRedisCommand implements ILanguageCommand {
  private static REDIS_KEY: string = 'Languages';

  public static getInstance(): LanguageRedisCommand {
    return new LanguageRedisCommand();
  }

  private constructor() {
  }

  public insertAll(languages: Array<Language>): Promise<any> {
    const languageJSON: Array<LanguageJSON> = languages.map<LanguageJSON>((language: Language) => {
      return language.toJSON();
    });

    return VeauRedis.getString().set(LanguageRedisCommand.REDIS_KEY, JSON.stringify(languageJSON));
  }

  public deleteAll(): Promise<any> {
    return VeauRedis.delete(LanguageRedisCommand.REDIS_KEY);
  }
}
