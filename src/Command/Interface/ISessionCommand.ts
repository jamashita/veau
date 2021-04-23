import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';

import { ICommand } from './ICommand';

export interface ISessionCommand<E extends DataSourceError = DataSourceError> extends ICommand<'SessionCommand'> {
  readonly noun: 'SessionCommand';

  delete(): Superposition<unknown, E>;
}
