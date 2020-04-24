import { DataSourceError, Superposition } from 'publikum';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Languages } from '../../VO/Languages';
import { IQuery } from './IQuery';

export interface ILanguageQuery extends IQuery {
  readonly noun: 'LanguageQuery';

  all(): Promise<Superposition<Languages, NoSuchElementError | DataSourceError>>;

  findByISO639(iso639: ISO639): Promise<Superposition<Language, NoSuchElementError | DataSourceError>>;
}
