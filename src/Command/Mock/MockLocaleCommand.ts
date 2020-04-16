import { injectable } from 'inversify';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { IMockCommand } from '../Interface/IMockCommand';

@injectable()
export class MockLocaleCommand implements ILocaleCommand, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
