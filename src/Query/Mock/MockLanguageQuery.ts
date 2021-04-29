import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { Language } from '../../VO/Language/Language';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IMockQuery } from './Interface/IMockQuery';

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
