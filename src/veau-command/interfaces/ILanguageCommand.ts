import { CacheError } from '../../veau-error/CacheError';
import { SourceError } from '../../veau-general/SourceError';
import { Try } from '../../veau-general/Try/Try';
import { Languages } from '../../veau-vo/Languages';
import { ICommand } from './ICommand';

export interface ILanguageCommand<E extends SourceError> extends ICommand {
  readonly noun: 'LanguageCommand';

  insertAll(languages: Languages): Promise<Try<void, E>>;

  deleteAll(): Promise<Try<void, CacheError | E>>;
}
