import { injectable } from 'inversify';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { Locale } from '../../veau-vo/Locale';
import { ILocaleCommand } from '../interfaces/ILocaleCommand';
import { IMockCommand } from '../interfaces/IMockCommand';

@injectable()
export class MockLocaleCommand implements ILocaleCommand, IMockCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public create(locale: Locale): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
