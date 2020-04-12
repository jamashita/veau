import { CacheError } from '../../Error/CacheError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { Languages } from '../../VO/Languages';
import { ILanguageCommand } from '../Interface/ILanguageCommand';
import { IMockCommand } from '../Interface/IMockCommand';

export class MockLanguageCommand implements ILanguageCommand, IMockCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public insertAll(languages: Languages): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteAll(): Promise<Try<void, CacheError | DataSourceError>> {
    return Promise.reject<Try<void, CacheError | DataSourceError>>(new UnimplementedError());
  }
}
