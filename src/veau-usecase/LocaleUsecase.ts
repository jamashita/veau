import { ILanguageCommand } from '../veau-command/interfaces/ILanguageCommand';
import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { RuntimeError } from '../veau-general/Error/RuntimeError';
import { ILanguageQuery } from '../veau-query/interfaces/ILanguageQuery';
import { IRegionQuery } from '../veau-query/interfaces/IRegionQuery';
import { LanguageQuery } from '../veau-query/LanguageQuery';
import { RegionQuery } from '../veau-query/RegionQuery';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Region, RegionJSON } from '../veau-vo/Region';
import { ILocaleUsecase } from './interfaces/ILocaleUsecase';

const languageQuery: ILanguageQuery = LanguageQuery.getInstance();
const regionQuery: IRegionQuery = RegionQuery.getInstance();
const languageCommand: ILanguageCommand = LanguageCommand.getInstance();
const regionCommand: RegionCommand = RegionCommand.getInstance();

export type Locales = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

export class LocaleUsecase implements ILocaleUsecase {
  private static instance: LocaleUsecase = new LocaleUsecase();

  public static getInstance(): LocaleUsecase {
    return LocaleUsecase.instance;
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

  public async deleteCache(): Promise<void> {
    const languageDeleted: boolean = await languageCommand.deleteAll();

    if (!languageDeleted) {
      throw new RuntimeError('FAILED TO DELETE LANGUAGES FROM STORAGE');
    }

    const regionDeleted: boolean = await regionCommand.deleteAll();

    if (!regionDeleted) {
      throw new RuntimeError('FAILED TO DELETE REGIONS FROM STORAGE');
    }
  }
}
