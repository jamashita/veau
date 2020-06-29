import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Languages } from '../../VO/Language/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand<E extends DataSourceError = DataSourceError> extends ICommand<'LanguageCommand'> {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Superposition<unknown, E>;

  deleteAll(): Superposition<unknown, E>;
}
