import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';

import { Locale } from '../../VO/Locale/Locale';
import { ICommand } from './ICommand';

export interface ILocaleCommand<E extends DataSourceError = DataSourceError> extends ICommand<'LocaleCommand'> {
  readonly noun: 'LocaleCommand';

  create(locale: Locale): Superposition<unknown, E>;
}
