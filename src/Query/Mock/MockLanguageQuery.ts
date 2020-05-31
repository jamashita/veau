import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
import { Language } from '../../VO/Language/Language';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockLanguageQuery implements ILanguageQuery, IMockQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>> {
    return Promise.reject<Superposition<Languages, LanguagesError | DataSourceError>>(new UnimplementedError());
  }

  public find(): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public findByISO639(): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}
