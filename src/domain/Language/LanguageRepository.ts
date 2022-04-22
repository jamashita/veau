import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { ISO639 } from './ISO639';
import { Language } from './Language';
import { LanguageError } from './LanguageError';
import { LanguageID } from './LanguageID';
import { Languages } from './Languages';

export interface LanguageRepository<E extends DataSourceError = DataSourceError> {
  all(): Promise<Schrodinger<Languages, E | LanguageError>>;

  createAll(languages: Languages): Promise<Schrodinger<unknown, E>>;

  deleteAll(): Promise<Schrodinger<unknown, E>>;

  find(id: LanguageID): Promise<Schrodinger<Language, E | LanguageError | NoSuchElementError>>;

  findByISO639(iso639: ISO639): Promise<Schrodinger<Language, E | LanguageError | NoSuchElementError>>;
}
