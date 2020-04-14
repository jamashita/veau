import { MockLanguageCommand } from '../../Command/Mock/MockLanguageCommand';
import { MockRegionCommand } from '../../Command/Mock/MockRegionCommand';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { MockLanguageQuery } from '../../Query/Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Query/Mock/MockRegionQuery';
import { Locale } from '../../VO/Locale';
import { LocaleInteractor } from '../LocaleInteractor';

export class MockLocaleInteractor extends LocaleInteractor {

  public constructor() {
    super(
      new MockLanguageQuery(),
      new MockRegionQuery(),
      new MockLanguageCommand(),
      new MockRegionCommand()
    );
  }

  public async all(): Promise<Try<Locale, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Try<Locale, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  public async delete(): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
