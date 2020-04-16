import { inject, injectable } from 'inversify';
import { ILocaleCommand } from '../../Command/Interface/ILocaleCommand';
import { TYPE } from '../../Container/Types';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Try } from '../../General/Superposition/Try';
import { Locale } from '../../VO/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IVaultQuery } from '../Interface/IVaultQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IVaultQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeAJAXQuery: ILocaleQuery;
  private readonly localeCacheQuery: ILocaleQuery;
  private readonly localeCommand: ILocaleCommand;

  public constructor(
  @inject(TYPE.LocaleAJAXQuery) localeAJAXQuery: ILocaleQuery,
    @inject(TYPE.LocaleCacheQuery) localeCacheQuery: ILocaleQuery,
    @inject(TYPE.LocaleCacheCommand) localeCommand: ILocaleCommand
  ) {
    this.localeAJAXQuery = localeAJAXQuery;
    this.localeCacheQuery = localeCacheQuery;
    this.localeCommand = localeCommand;
  }

  public async all(): Promise<Try<Locale, DataSourceError>> {
    const trial1: Try<Locale, DataSourceError> = await this.localeCacheQuery.all();

    return trial1.match<Locale, DataSourceError>((locale: Locale) => {
      return Promise.resolve<Try<Locale, DataSourceError>>(Success.of<Locale, DataSourceError>(locale));
    }, async () => {
      const trial2: Try<Locale, DataSourceError> = await this.localeAJAXQuery.all();

      return trial2.match<Locale, DataSourceError>(async (locale: Locale) => {
        const trial3: Try<void, DataSourceError> = await this.localeCommand.create(locale);

        return trial3.match<Locale, DataSourceError>(() => {
          return Success.of<Locale, DataSourceError>(locale);
        }, (err: DataSourceError, self: Failure<void, DataSourceError>) => {
          return self.transpose<Locale>();
        });
      }, (err: DataSourceError, self: Failure<Locale, DataSourceError>) => {
        return Promise.resolve<Try<Locale, DataSourceError>>(self);
      });
    });
  }
}
