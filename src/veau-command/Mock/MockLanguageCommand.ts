import { CacheError } from '../../veau-error/CacheError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { Languages } from '../../veau-vo/Languages';
import { ILanguageCommand } from '../interfaces/ILanguageCommand';
import { IMockCommand } from '../interfaces/IMockCommand';

export class MockLanguageCommand implements ILanguageCommand, IMockCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async insertAll(languages: Languages): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deleteAll(): Promise<Try<void, CacheError | DataSourceError>> {
    return Promise.reject<Try<void, CacheError | DataSourceError>>(new UnimplementedError());
  }
}
