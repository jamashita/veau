import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { Locale } from '../../VO/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IMockQuery } from '../Interface/IMockQuery';

export class MockLocaleQuery implements ILocaleQuery, IMockQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Promise<Try<Locale, DataSourceError>> {
    return Promise.reject<Try<Locale, DataSourceError>>(new UnimplementedError());
  }
}
