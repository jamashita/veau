import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language } from '../../../domain/vo/Language/Language';
import { LanguageID } from '../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../domain/vo/Language/Languages';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface ILanguageQuery<E extends DataSourceError = DataSourceError> extends IQuery<'LanguageQuery'> {
  readonly noun: 'LanguageQuery';

  all(): Superposition<Languages, E | LanguageError>;

  find(languageID: LanguageID): Superposition<Language, E | LanguageError | NoSuchElementError>;

  findByISO639(iso639: ISO639): Superposition<Language, E | LanguageError | NoSuchElementError>;
}
