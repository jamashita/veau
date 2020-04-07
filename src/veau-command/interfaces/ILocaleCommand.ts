import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { Locale } from '../../veau-vo/Locale';
import { ICommand } from './ICommand';

export interface ILocaleCommand extends ICommand {
  readonly noun: 'LocaleCommand';

  create(locale: Locale): Promise<Try<void, DataSourceError>>;
}
