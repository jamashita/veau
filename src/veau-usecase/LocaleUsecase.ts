import { ILanguageRepository, LanguageRepository } from '../veau-repository/LanguageRepository';
import { IRegionRepository, RegionRepository } from '../veau-repository/RegionRepository';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Region, RegionJSON } from '../veau-vo/Region';

const languageRepository: ILanguageRepository = LanguageRepository.getInstance();
const regionRepository: IRegionRepository = RegionRepository.getInstance();

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
    const languages: Array<Language> = await languageRepository.all();
    const regions: Array<Region> = await regionRepository.all();

    return {
      languages: languages.map<LanguageJSON>((language: Language) => {
        return language.toJSON();
      }),
      regions: regions.map<RegionJSON>((region: Region) => {
        return region.toJSON();
      })
    };
  }
}

export interface ILocaleUsecase {

  all(): Promise<Locales>;
}
