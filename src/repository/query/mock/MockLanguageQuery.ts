import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError.js';
import { Language } from '../../../domain/vo/Language/Language.js';
import { Languages } from '../../../domain/vo/Language/Languages.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { ILanguageQuery } from '../ILanguageQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockLanguageQuery implements ILanguageQuery, IMockQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Languages, DataSourceError | LanguageError> {
    throw new UnimplementedError();
  }

  public find(): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    throw new UnimplementedError();
  }

  public findByISO639(): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    throw new UnimplementedError();
  }
}
