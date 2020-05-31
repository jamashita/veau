import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Locale } from '../../VO/Locale/Locale';
import { ICommand } from './ICommand';

export interface ILocaleCommand extends ICommand {
  readonly noun: 'LocaleCommand';

  create(locale: Locale): Promise<Superposition<unknown, DataSourceError>>;
}
