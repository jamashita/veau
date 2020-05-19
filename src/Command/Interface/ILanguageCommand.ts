import { DataSourceError, Superposition } from 'publikum';

import { Languages } from '../../VO/Language/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand extends ICommand {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Promise<Superposition<unknown, DataSourceError>>;

  deleteAll(): Promise<Superposition<unknown, DataSourceError>>;
}
