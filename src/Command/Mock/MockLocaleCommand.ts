import { injectable } from 'inversify';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { Locale } from '../../VO/Locale';
import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { IMockCommand } from '../Interface/IMockCommand';

@injectable()
export class MockLocaleCommand implements ILocaleCommand, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public create(locale: Locale): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
