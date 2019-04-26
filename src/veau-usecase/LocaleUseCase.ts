import { ILanguageCommand } from '../veau-command/interfaces/ILanguageCommand';
import { IRegionCommand } from '../veau-command/interfaces/IRegionCommand';
import { LanguageRedisCommand } from '../veau-command/LanguageRedisCommand';
import { RegionRedisCommand } from '../veau-command/RegionRedisCommand';
import { ILanguageQuery } from '../veau-query/interfaces/ILanguageQuery';
import { IRegionQuery } from '../veau-query/interfaces/IRegionQuery';
import { LanguageMySQLQuery } from '../veau-query/LanguageMySQLQuery';
import { LanguageRedisQuery } from '../veau-query/LanguageRedisQuery';
import { RegionMySQLQuery } from '../veau-query/RegionMySQLQuery';
import { RegionRedisQuery } from '../veau-query/RegionRedisQuery';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Region, RegionJSON } from '../veau-vo/Region';

export type Locales = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

export class LocaleUseCase {
  private static instance: LocaleUseCase = new LocaleUseCase();
  private static languageMySQLQuery: ILanguageQuery = LanguageMySQLQuery.getInstance();
  private static languageRedisQuery: ILanguageQuery = LanguageRedisQuery.getInstance();
  private static languageRedisCommand: ILanguageCommand = LanguageRedisCommand.getInstance();
  private static regionMySQLQuery: IRegionQuery = RegionMySQLQuery.getInstance();
  private static regionRedisQuery: IRegionQuery = RegionRedisQuery.getInstance();
  private static regionRedisCommand: IRegionCommand = RegionRedisCommand.getInstance();

  public static getInstance(): LocaleUseCase {
    return LocaleUseCase.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Locales> {
    const languages: Array<Language> = await this.getLanguages();
    const regions: Array<Region> = await this.getRegions();

    return {
      languages: languages.map<LanguageJSON>((language: Language) => {
        return language.toJSON();
      }),
      regions: regions.map<RegionJSON>((region: Region) => {
        return region.toJSON();
      })
    };
  }

  private async getLanguages(): Promise<Array<Language>> {
    const languages: Array<Language> = await LocaleUseCase.languageRedisQuery.allLanguages();

    if (languages.length !== 0) {
      return languages;
    }

    const newLanguages: Array<Language> = await LocaleUseCase.languageMySQLQuery.allLanguages();
    await LocaleUseCase.languageRedisCommand.insertAll(newLanguages);

    return newLanguages;
  }

  private async getRegions(): Promise<Array<Region>> {
    const regions: Array<Region> = await LocaleUseCase.regionRedisQuery.allRegions();

    if (regions.length !== 0) {
      return regions;
    }

    const newRegions: Array<Region> = await LocaleUseCase.regionMySQLQuery.allRegions();
    await LocaleUseCase.regionRedisCommand.insertAll(newRegions);

    return newRegions;
  }

  public async deleteCache(): Promise<any> {
    return Promise.all<any>([
      LocaleUseCase.languageRedisCommand.deleteAll(),
      LocaleUseCase.regionRedisCommand.deleteAll()
    ]);
  }
}
