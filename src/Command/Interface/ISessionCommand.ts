import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { ICommand } from './ICommand';

export interface ISessionCommand<E extends DataSourceError = DataSourceError> extends ICommand<'SessionCommand'> {
  readonly noun: 'SessionCommand';

  delete(): Superposition<unknown, E>;
}
