import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockLocaleCommand<E extends DataSourceError = DataSourceError> implements ILocaleCommand<E>, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
