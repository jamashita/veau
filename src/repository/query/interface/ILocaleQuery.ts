import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { IQuery } from './IQuery';

export interface ILocaleQuery<E extends DataSourceError = DataSourceError> extends IQuery<'LocaleQuery'> {
  readonly noun: 'LocaleQuery';

  all(): Superposition<Locale, E | LocaleError>;
}
