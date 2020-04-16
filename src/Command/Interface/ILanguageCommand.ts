import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { Languages } from '../../VO/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand extends ICommand {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Promise<Superposition<void, DataSourceError>>;

  deleteAll(): Promise<Superposition<void, DataSourceError>>;
}
