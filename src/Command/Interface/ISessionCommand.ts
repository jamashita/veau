import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { ICommand } from './ICommand';

export interface ISessionCommand extends ICommand {
  readonly noun: 'SessionCommand';

  delete(): Promise<Try<void, DataSourceError>>;
}
