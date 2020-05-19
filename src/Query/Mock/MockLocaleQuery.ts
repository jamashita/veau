import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockLocaleQuery implements ILocaleQuery, IMockQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Promise<Superposition<Locale, DataSourceError>> {
    return Promise.reject<Superposition<Locale, DataSourceError>>(new UnimplementedError());
  }
}
