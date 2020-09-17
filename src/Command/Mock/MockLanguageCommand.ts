import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { ILanguageCommand } from '../Interface/ILanguageCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockLanguageCommand<E extends DataSourceError = DataSourceError> implements ILanguageCommand<E>, IMockCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Mock' = 'Mock';

  public insertAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public deleteAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
