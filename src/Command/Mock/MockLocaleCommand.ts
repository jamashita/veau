import { injectable } from 'inversify';
import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { IMockCommand } from './Interface/IMockCommand';

@injectable()
export class MockLocaleCommand implements ILocaleCommand, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }
}
