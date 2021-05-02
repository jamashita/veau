import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { ICommand } from './ICommand';

export interface ILocaleCommand<E extends DataSourceError = DataSourceError> extends ICommand<'LocaleCommand'> {
  readonly noun: 'LocaleCommand';

  create(locale: Locale): Superposition<unknown, E>;
}
