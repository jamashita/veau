import { RuntimeError } from '../veau-general/RuntimeError';
import { ILanguageRepository, LanguageRepository } from '../veau-repository/LanguageRepository';
import { IRegionRepository, RegionRepository } from '../veau-repository/RegionRepository';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Region, RegionJSON } from '../veau-vo/Region';
import { ILocaleUsecase } from './ILocaleUsecase';

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

  public async deleteCache(): Promise<void> {
    const languageDeleted: boolean = await languageRepository.deleteCache();

    if (!languageDeleted) {
      throw new RuntimeError('FAILED TO DELETE LANGUAGES FROM STORAGE');
    }

    const regionDeleted: boolean = await regionRepository.deleteCache();

    if (!regionDeleted) {
      throw new RuntimeError('FAILED TO DELETE REGIONS FROM STORAGE');
    }
  }
}
