import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { SourceError } from '../../veau-general/SourceError';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { IQuery } from './IQuery';

export interface ILanguageQuery<E extends SourceError> extends IQuery {
  readonly noun: 'LanguageQuery';

  all(): Promise<Try<Languages, NoSuchElementError | E>>;

  findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | E>>;
}
