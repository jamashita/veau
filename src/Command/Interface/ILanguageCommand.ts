import { CacheError } from '../../Error/CacheError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { Languages } from '../../VO/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand extends ICommand {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Promise<Try<void, DataSourceError>>;

  deleteAll(): Promise<Try<void, CacheError | DataSourceError>>;
}
