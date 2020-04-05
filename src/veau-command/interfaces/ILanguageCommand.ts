import { CacheError } from '../../veau-error/CacheError';
import { Try } from '../../veau-general/Try/Try';
import { Languages } from '../../veau-vo/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand extends ICommand {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Promise<unknown>;

  deleteAll(): Promise<Try<void, CacheError>>;
}
