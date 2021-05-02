import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { ICommand } from './ICommand';

export interface ISessionCommand<E extends DataSourceError = DataSourceError> extends ICommand<'SessionCommand'> {
  readonly noun: 'SessionCommand';

  delete(): Superposition<unknown, E>;
}
