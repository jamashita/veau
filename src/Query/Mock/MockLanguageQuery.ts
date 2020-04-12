import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Languages } from '../../VO/Languages';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IMockQuery } from '../Interface/IMockQuery';

export class MockLanguageQuery implements ILanguageQuery, IMockQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public all(): Promise<Try<Languages, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Try<Languages, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Try<Language, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }
}
