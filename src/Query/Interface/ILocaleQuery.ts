import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { LocaleError } from '../../domain/VO/Locale/Error/LocaleError';
import { Locale } from '../../domain/VO/Locale/Locale';
import { IQuery } from './IQuery';

export interface ILocaleQuery<E extends DataSourceError = DataSourceError> extends IQuery<'LocaleQuery'> {
  readonly noun: 'LocaleQuery';

  all(): Superposition<Locale, E | LocaleError>;
}
