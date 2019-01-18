import {NoSuchElementError} from '../veau-general/Error';
import {VeauDB} from '../veau-infrastructure/VeauDB';
import {VeauRedis} from '../veau-infrastructure/VeauRedis';
import {ISO3166} from '../veau-vo/ISO3166';
import {Locale, LocaleJSON} from '../veau-vo/Locale';

const REDIS_KEY = 'Locales';

export class LocaleRepository implements ILocaleRepository {
  private static instance: LocaleRepository = new LocaleRepository();

  public static getInstance(): LocaleRepository {
    return LocaleRepository.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Array<Locale>> {
    const localeString: string = await VeauRedis.getString().get(REDIS_KEY);

    if (localeString) {
      const localeJSONs: Array<LocaleJSON> = JSON.parse(localeString);
      return localeJSONs.map<Locale>((json) => {
        return this.toLocale(json);
      });
    }

    const query = `SELECT
      R1.name,
      R1.iso3166
      FROM locales R1;`;

    const localeJSONs: Array<LocaleJSON> = await VeauDB.query(query);
    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(localeJSONs));
    return localeJSONs.map<Locale>((json) => {
      return this.toLocale(json);
    });
  }

  private toLocale(json: LocaleJSON): Locale {
    const {
      name,
      iso3166
    } = json;

    return Locale.of(name, ISO3166.of(iso3166));
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Locale> {
    const locales: Array<Locale> = await this.all();
    const filtered: Array<Locale> = locales.filter((locale) => {
      if (locale.getISO3166().equals(iso3166)) {
        return true;
      }

      return false;
    });

    if (filtered.length === 0) {
      throw new NoSuchElementError(iso3166.get());
    }

    return filtered[0];
  }
}

export interface ILocaleRepository {

  all(): Promise<Array<Locale>>;
  findByISO3166(iso3166: ISO3166): Promise<Locale>;
}
