import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { ILanguageCommand } from '../interface/ILanguageCommand';
import { IMockCommand } from './IMockCommand';

export class MockLanguageCommand<E extends DataSourceError = DataSourceError> implements ILanguageCommand<E>, IMockCommand {
  public readonly noun: 'LanguageCommand' = 'LanguageCommand';
  public readonly source: 'Mock' = 'Mock';

  public deleteAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public insertAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
