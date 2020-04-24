import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Languages } from '../../VO/Languages';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IMockQuery } from '../Interface/IMockQuery';

export class MockLanguageQuery implements ILanguageQuery, IMockQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public all(): Promise<Superposition<Languages, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Languages, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByISO639(iso639: ISO639): Promise<Superposition<Language, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Language, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }
}
