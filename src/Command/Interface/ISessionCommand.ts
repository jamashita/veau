import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { ICommand } from './ICommand';

export interface ISessionCommand extends ICommand {
  readonly noun: 'SessionCommand';

  delete(): Superposition<unknown, DataSourceError>;
}
