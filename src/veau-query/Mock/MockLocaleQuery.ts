import { injectable } from 'inversify';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { ILocaleQuery } from '../interfaces/ILocaleQuery';
import { IMockQuery } from '../interfaces/IMockQuery';

@injectable()
export class MockLocaleQuery implements ILocaleQuery, IMockQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Try<Language, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Try<Region, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  public async all(): Promise<Try<Locale, DataSourceError>> {
    return Promise.reject<Try<Locale, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }
}
