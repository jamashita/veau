import { inject, injectable } from 'inversify';
import { ILocaleCommand } from '../../veau-command/interfaces/ILocaleCommand';
import { TYPE } from '../../veau-container/Types';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Locale } from '../../veau-vo/Locale';
import { ILocaleQuery } from '../interfaces/ILocaleQuery';
import { IVaultQuery } from '../interfaces/IVaultQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IVaultQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeAJAXQuery: ILocaleQuery;
  private readonly localeHeapQuery: ILocaleQuery;
  private readonly localeCommand: ILocaleCommand;

  public constructor(@inject(TYPE.LocaleAJAXQuery) localeAJAXQuery: ILocaleQuery,
    @inject(TYPE.LocaleHeapQuery) localeHeapQuery: ILocaleQuery,
    @inject(TYPE.LocaleHeapCommand) localeCommand: ILocaleCommand) {
    this.localeAJAXQuery = localeAJAXQuery;
    this.localeHeapQuery = localeHeapQuery;
    this.localeCommand = localeCommand;
  }

  public async all(): Promise<Try<Locale, DataSourceError>> {
    const trial1: Try<Locale, DataSourceError> = await this.localeHeapQuery.all();

    return trial1.match<Promise<Try<Locale, DataSourceError>>>((locale: Locale) => {
      return Promise.resolve<Try<Locale, DataSourceError>>(Success.of<Locale, DataSourceError>(locale));
    }, async () => {
      const trial2: Try<Locale, DataSourceError> = await this.localeAJAXQuery.all();

      return trial2.match<Promise<Try<Locale, DataSourceError>>>(async (locale: Locale) => {
        const trial3: Try<void, DataSourceError> =await this.localeCommand.create(locale);

        return trial3.match<Try<Locale, DataSourceError>>(() => {
          return Success.of<Locale, DataSourceError>(locale);
        }, (err: DataSourceError) => {
          return Failure.of<Locale, DataSourceError>(err);
        });
      }, (err: DataSourceError) => {
        return Promise.resolve<Try<Locale, DataSourceError>>(Failure.of<Locale, DataSourceError>(err));
      });
    });
  }
}
