import { inject, injectable } from 'inversify';
import { ILocaleCommand } from '../../Command/Interface/ILocaleCommand';
import { TYPE } from '../../Container/Types';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
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

  public async all(): Promise<Superposition<Locale, DataSourceError>> {
    const superposition1: Superposition<Locale, DataSourceError> = await this.localeCacheQuery.all();

    return superposition1.match<Locale, DataSourceError>((locale: Locale) => {
      return Promise.resolve<Superposition<Locale, DataSourceError>>(Success.of<Locale, DataSourceError>(locale));
    }, async () => {
      const superposition2: Superposition<Locale, DataSourceError> = await this.localeAJAXQuery.all();

      return superposition2.match<Locale, DataSourceError>(async (locale: Locale) => {
        const superposition3: Superposition<void, DataSourceError> = await this.localeCommand.create(locale);

        return superposition3.match<Locale, DataSourceError>(() => {
          return Success.of<Locale, DataSourceError>(locale);
        }, (err: DataSourceError, self: Failure<void, DataSourceError>) => {
          return self.transpose<Locale>();
        });
      }, (err: DataSourceError, self: Failure<Locale, DataSourceError>) => {
        return Promise.resolve<Superposition<Locale, DataSourceError>>(self);
      });
    });
  }
}
