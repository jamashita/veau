import { CacheError } from '../../veau-error/CacheError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { Languages } from '../../veau-vo/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand extends ICommand {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Promise<Try<void, DataSourceError>>;

  deleteAll(): Promise<Try<void, CacheError | DataSourceError>>;
}
