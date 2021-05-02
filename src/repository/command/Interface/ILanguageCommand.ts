import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { Languages } from '../../domain/vo/Language/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand<E extends DataSourceError = DataSourceError> extends ICommand<'LanguageCommand'> {
  readonly noun: 'LanguageCommand';

  deleteAll(): Superposition<unknown, E>;

  insertAll(languages: Languages): Superposition<unknown, E>;
}
