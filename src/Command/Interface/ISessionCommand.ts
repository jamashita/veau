import { DataSourceError, Superposition } from 'publikum';
import { ICommand } from './ICommand';

export interface ISessionCommand extends ICommand {
  readonly noun: 'SessionCommand';

  delete(): Promise<Superposition<void, DataSourceError>>;
}
