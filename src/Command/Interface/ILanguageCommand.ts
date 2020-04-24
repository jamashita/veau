import { DataSourceError, Superposition } from 'publikum';
import { Languages } from '../../VO/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand extends ICommand {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Promise<Superposition<void, DataSourceError>>;

  deleteAll(): Promise<Superposition<void, DataSourceError>>;
}
