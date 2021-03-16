import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface ILanguageQuery<E extends DataSourceError = DataSourceError> extends IQuery<'LanguageQuery'> {
  readonly noun: 'LanguageQuery';

  all(): Superposition<Languages, LanguageError | E>;

  find(languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | E>;

  findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | E>;
}
