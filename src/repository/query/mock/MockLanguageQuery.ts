import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { Language } from '../../../domain/vo/Language/Language';
import { Languages } from '../../../domain/vo/Language/Languages';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { IMockQuery } from './IMockQuery';

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
