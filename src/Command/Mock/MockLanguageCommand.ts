import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { ILanguageCommand } from '../Interface/ILanguageCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockLanguageCommand implements ILanguageCommand, IMockCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Mock' = 'Mock';

  public insertAll(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }

  public deleteAll(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }
}
