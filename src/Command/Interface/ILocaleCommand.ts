import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { Locale } from '../../VO/Locale';
import { ICommand } from './ICommand';

export interface ILocaleCommand extends ICommand {
  readonly noun: 'LocaleCommand';

  create(locale: Locale): Promise<Try<void, DataSourceError>>;
}
