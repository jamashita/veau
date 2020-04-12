import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { ICommand } from './ICommand';

export interface ISessionCommand extends ICommand {
  readonly noun: 'SessionCommand';

  delete(): Promise<Try<void, DataSourceError>>;
}
