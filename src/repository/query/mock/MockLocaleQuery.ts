import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IMockQuery } from './IMockQuery';

export class MockLocaleQuery implements ILocaleQuery, IMockQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Locale, DataSourceError> {
    throw new UnimplementedError();
  }
}
