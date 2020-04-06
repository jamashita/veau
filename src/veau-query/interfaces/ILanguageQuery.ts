import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { IQuery } from './IQuery';

export interface ILanguageQuery extends IQuery {
  readonly noun: 'LanguageQuery';

  all(): Promise<Try<Languages, NoSuchElementError | DataSourceError>>;

  findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>>;
}
