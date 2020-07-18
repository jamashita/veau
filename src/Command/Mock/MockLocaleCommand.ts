import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockLocaleCommand<E extends DataSourceError = DataSourceError> implements ILocaleCommand<E>, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
