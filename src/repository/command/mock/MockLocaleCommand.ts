import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { ILocaleCommand } from '../ILocaleCommand.js';
import { IMockCommand } from './IMockCommand.js';

export class MockLocaleCommand<E extends DataSourceError = DataSourceError> implements ILocaleCommand<E>, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
