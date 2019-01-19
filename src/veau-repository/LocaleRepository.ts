import { NoSuchElementError } from '../veau-general/Error';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../veau-vo/ISO3166';
import { Locale, LocaleRow } from '../veau-vo/Locale';
import { LocaleID } from '../veau-vo/LocaleID';

const REDIS_KEY = 'Locales';

export class LocaleRepository implements ILocaleRepository {
  private static instance: LocaleRepository = new LocaleRepository();

  public static getInstance(): LocaleRepository {
    return LocaleRepository.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Array<Locale>> {
    const localeString: string | null = await VeauRedis.getString().get(REDIS_KEY);

    if (localeString) {
      const localeRows: Array<LocaleRow> = JSON.parse(localeString);
      return localeRows.map<Locale>((row) => {
        return this.toLocale(row);
      });
    }

    const query = `SELECT
      R1.locale_id AS localeID,
      R1.name,
      R1.iso3166
      FROM locales R1;`;

    const locales: Array<LocaleRow> = await VeauMySQL.query(query);
    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(locales));
    return locales.map<Locale>((row) => {
      return this.toLocale(row);
    });
  }

  private toLocale(row: LocaleRow): Locale {
    const {
      localeID,
      name,
      iso3166
    } = row;

    return Locale.of(LocaleID.of(localeID), name, ISO3166.of(iso3166));
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
