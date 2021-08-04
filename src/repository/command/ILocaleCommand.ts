import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Locale } from '../../domain/vo/Locale/Locale.js';
import { ICommand } from './ICommand.js';

export interface ILocaleCommand<E extends DataSourceError = DataSourceError> extends ICommand<'LocaleCommand'> {
  readonly noun: 'LocaleCommand';

  create(locale: Locale): Superposition<unknown, E>;
}
