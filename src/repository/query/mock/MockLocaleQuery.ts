import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { ILocaleQuery } from '../ILocaleQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockLocaleQuery implements ILocaleQuery, IMockQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Locale, DataSourceError> {
    throw new UnimplementedError();
  }
}
