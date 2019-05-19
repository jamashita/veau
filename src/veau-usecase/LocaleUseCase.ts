import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { Language } from '../veau-entity/Language';
import { Region } from '../veau-entity/Region';
import { LanguageQuery } from '../veau-query/LanguageQuery';
import { RegionQuery } from '../veau-query/RegionQuery';

export type Locales = {
  languages: Array<Language>;
  regions: Array<Region>;
};

const languageQuery: LanguageQuery = LanguageQuery.getInstance();
const languageCommand: LanguageCommand = LanguageCommand.getInstance();
const regionQuery: RegionQuery = RegionQuery.getInstance();
const regionCommand: RegionCommand = RegionCommand.getInstance();

export class LocaleUseCase {
  private static instance: LocaleUseCase = new LocaleUseCase();

  public static getInstance(): LocaleUseCase {
    return LocaleUseCase.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Locales> {
    const languages: Array<Language> = await languageQuery.all();
    const regions: Array<Region> = await regionQuery.all();

    return {
      languages,
      regions
    };
  }

  public delete(): Promise<any> {
    return Promise.all<any>([
      languageCommand.deleteAll(),
      regionCommand.deleteAll()
    ]);
  }
}
