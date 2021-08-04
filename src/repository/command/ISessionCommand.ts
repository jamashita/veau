import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { ICommand } from './ICommand.js';

export interface ISessionCommand<E extends DataSourceError = DataSourceError> extends ICommand<'SessionCommand'> {
  readonly noun: 'SessionCommand';

  delete(): Superposition<unknown, E>;
}
