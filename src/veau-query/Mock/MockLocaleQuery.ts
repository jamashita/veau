import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { Locale } from '../../veau-vo/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IMockQuery } from '../Interface/IMockQuery';

export class MockLocaleQuery implements ILocaleQuery, IMockQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Promise<Try<Locale, DataSourceError>> {
    return Promise.reject<Try<Locale, DataSourceError>>(new UnimplementedError());
  }
}
