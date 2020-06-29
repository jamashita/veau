import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { IQuery } from './IQuery';

export interface ILocaleQuery<E extends DataSourceError = DataSourceError> extends IQuery<'LocaleQuery'> {
  readonly noun: 'LocaleQuery';

  all(): Superposition<Locale, LocaleError | E>;
}
