import { DataSourceError, Superposition } from 'publikum';

import { NoSuchElementError } from '../Error/NoSuchElementError';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { IQuery } from './IQuery';

export interface ILanguageQuery extends IQuery {
  readonly noun: 'LanguageQuery';

  all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>>;

  find(languageID: LanguageID): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>;

  findByISO639(iso639: ISO639): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>;
}
