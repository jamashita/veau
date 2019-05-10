import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { Language, LanguageJSON } from '../veau-entity/Language';
import { Region, RegionJSON } from '../veau-entity/Region';
import { LanguageQuery } from '../veau-query/LanguageQuery';
import { RegionQuery } from '../veau-query/RegionQuery';

export type Locales = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
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
    const languages: Array<Language> = await languageQuery.allLanguages();
    const regions: Array<Region> = await regionQuery.allRegions();

    return {
      languages: languages.map<LanguageJSON>((language: Language) => {
        return language.toJSON();
      }),
      regions: regions.map<RegionJSON>((region: Region) => {
        return region.toJSON();
      })
    };
  }

  public delete(): Promise<any> {
    return Promise.all<any>([
      languageCommand.deleteAll(),
      regionCommand.deleteAll()
    ]);
  }
}
