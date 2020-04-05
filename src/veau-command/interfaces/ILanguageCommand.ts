import { CacheError } from '../../veau-error/CacheError';
import { Try } from '../../veau-general/Try/Try';
import { Languages } from '../../veau-vo/Languages';

export interface ILanguageCommand {

  insertAll(languages: Languages): Promise<unknown>;

  deleteAll(): Promise<Try<void, CacheError>>;
}
