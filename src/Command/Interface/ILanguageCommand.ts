import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { Languages } from '../../VO/Language/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand<E extends DataSourceError = DataSourceError> extends ICommand<'LanguageCommand'> {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Superposition<unknown, E>;

  deleteAll(): Superposition<unknown, E>;
}
