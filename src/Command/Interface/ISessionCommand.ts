import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { ICommand } from './ICommand';

export interface ISessionCommand extends ICommand {
  readonly noun: 'SessionCommand';

  delete(): Promise<Superposition<void, DataSourceError>>;
}
