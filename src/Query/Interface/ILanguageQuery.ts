import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Languages } from '../../VO/Languages';
import { IQuery } from './IQuery';

export interface ILanguageQuery extends IQuery {
  readonly noun: 'LanguageQuery';

  all(): Promise<Try<Languages, NoSuchElementError | DataSourceError>>;

  findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>>;
}
