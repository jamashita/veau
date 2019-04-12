import { ILanguageCommand } from '../veau-command/interfaces/ILanguageCommand';
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
import { ILocaleUsecase } from './interfaces/ILocaleUsecase';

const LANGUAGES_REDIS_KEY: string = 'LANGUAGES';
const REGIONS_REDIS_KEY: string = 'REGIONS';

const languageMySQLQuery: ILanguageQuery = LanguageMySQLQuery.getInstance();
const languageRedisQuery: ILanguageQuery = LanguageRedisQuery.getInstance(LANGUAGES_REDIS_KEY);
const languageRedisCommand: ILanguageCommand = LanguageRedisCommand.getInstance();
const regionMySQLQuery: IRegionQuery = RegionMySQLQuery.getInstance();
const regionRedisQuery: IRegionQuery = RegionRedisQuery.getInstance(REGIONS_REDIS_KEY);
const regionRedisCommand: RegionRedisCommand = RegionRedisCommand.getInstance();

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

    return languageMySQLQuery.allLanguages();
  }

  private async getRegions(): Promise<Array<Region>> {
    const regions: Array<Region> = await regionRedisQuery.allRegions();

    if (regions.length !== 0) {
      return regions;
    }

    return regionMySQLQuery.allRegions();
  }

  public async deleteCache(): Promise<any> {
    return Promise.all<any>([
      languageRedisCommand.deleteAll(),
      regionRedisCommand.deleteAll()
    ]);
  }
}
