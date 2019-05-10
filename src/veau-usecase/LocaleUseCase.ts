import { ILanguageCommand } from '../veau-command/interfaces/ILanguageCommand';
import { IRegionCommand } from '../veau-command/interfaces/IRegionCommand';
import { LanguageRedisCommand } from '../veau-command/LanguageRedisCommand';
import { RegionRedisCommand } from '../veau-command/RegionRedisCommand';
import { Language, LanguageJSON } from '../veau-entity/Language';
import { Region, RegionJSON } from '../veau-entity/Region';
import { ILanguageQuery } from '../veau-query/interfaces/ILanguageQuery';
import { IRegionQuery } from '../veau-query/interfaces/IRegionQuery';
import { LanguageMySQLQuery } from '../veau-query/LanguageMySQLQuery';
import { LanguageRedisQuery } from '../veau-query/LanguageRedisQuery';
import { RegionMySQLQuery } from '../veau-query/RegionMySQLQuery';
import { RegionRedisQuery } from '../veau-query/RegionRedisQuery';

export type Locales = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

const languageMySQLQuery: ILanguageQuery = LanguageMySQLQuery.getInstance();
const languageRedisQuery: ILanguageQuery = LanguageRedisQuery.getInstance();
const languageRedisCommand: ILanguageCommand = LanguageRedisCommand.getInstance();
const regionMySQLQuery: IRegionQuery = RegionMySQLQuery.getInstance();
const regionRedisQuery: IRegionQuery = RegionRedisQuery.getInstance();
const regionRedisCommand: IRegionCommand = RegionRedisCommand.getInstance();

export class LocaleUseCase {
  private static instance: LocaleUseCase = new LocaleUseCase();

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
    const languages: Array<Language> = await languageRedisQuery.allLanguages();

    if (languages.length !== 0) {
      return languages;
    }

    const newLanguages: Array<Language> = await languageMySQLQuery.allLanguages();
    await languageRedisCommand.insertAll(newLanguages);

    return newLanguages;
  }

  private async getRegions(): Promise<Array<Region>> {
    const regions: Array<Region> = await regionRedisQuery.allRegions();

    if (regions.length !== 0) {
      return regions;
    }

    const newRegions: Array<Region> = await regionMySQLQuery.allRegions();
    await regionRedisCommand.insertAll(newRegions);

    return newRegions;
  }

  public deleteCache(): Promise<any> {
    return Promise.all<any>([
      languageRedisCommand.deleteAll(),
      regionRedisCommand.deleteAll()
    ]);
  }
}
