import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { LanguageError } from '../../domain/vo/Language/error/LanguageError.js';
import { ISO639 } from '../../domain/vo/Language/ISO639.js';
import { Language } from '../../domain/vo/Language/Language.js';
import { LanguageID } from '../../domain/vo/Language/LanguageID.js';
import { Languages } from '../../domain/vo/Language/Languages.js';
import { NoSuchElementError } from './error/NoSuchElementError.js';
import { IQuery } from './IQuery.js';

export interface ILanguageQuery<E extends DataSourceError = DataSourceError> extends IQuery<'LanguageQuery'> {
  readonly noun: 'LanguageQuery';

  all(): Superposition<Languages, E | LanguageError>;

  find(languageID: LanguageID): Superposition<Language, E | LanguageError | NoSuchElementError>;

  findByISO639(iso639: ISO639): Superposition<Language, E | LanguageError | NoSuchElementError>;
}
