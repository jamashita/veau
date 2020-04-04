import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Try } from '../veau-general/Try/Try';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { Languages } from '../veau-vo/Languages';

export interface ILanguageQuery {

  all(): Promise<Languages>;

  findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError>>;
}
