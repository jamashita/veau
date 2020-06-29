import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockLocaleCommand implements ILocaleCommand, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }
}
