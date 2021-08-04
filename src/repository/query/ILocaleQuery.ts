import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { IQuery } from './IQuery.js';

export interface ILocaleQuery<E extends DataSourceError = DataSourceError> extends IQuery<'LocaleQuery'> {
  readonly noun: 'LocaleQuery';

  all(): Superposition<Locale, E | LocaleError>;
}
