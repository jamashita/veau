import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Languages } from '../../domain/vo/Language/Languages.js';
import { ICommand } from './ICommand.js';

export interface ILanguageCommand<E extends DataSourceError = DataSourceError> extends ICommand<'LanguageCommand'> {
  readonly noun: 'LanguageCommand';

  deleteAll(): Superposition<unknown, E>;

  insertAll(languages: Languages): Superposition<unknown, E>;
}
