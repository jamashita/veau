import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { Language } from '../../VO/Language/Language';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockLanguageQuery implements ILanguageQuery, IMockQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Languages, LanguageError | DataSourceError> {
    throw new UnimplementedError();
  }

  public find(): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByISO639(): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }
}
