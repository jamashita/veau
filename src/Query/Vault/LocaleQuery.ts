import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';

import { ILocaleCommand } from '../../Command/Interface/ILocaleCommand';
import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IVaultQuery } from './Interface/IVaultQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IVaultQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeAJAXQuery: ILocaleQuery;
  private readonly localeCacheQuery: ILocaleQuery;
  private readonly localeCommand: ILocaleCommand;

  public constructor(
    @inject(Type.LocaleAJAXQuery) localeAJAXQuery: ILocaleQuery,
    @inject(Type.LocaleCacheQuery) localeCacheQuery: ILocaleQuery,
    @inject(Type.LocaleCacheCommand) localeCommand: ILocaleCommand
  ) {
    this.localeAJAXQuery = localeAJAXQuery;
    this.localeCacheQuery = localeCacheQuery;
    this.localeCommand = localeCommand;
  }

  public async all(): Promise<Superposition<Locale, LocaleError | DataSourceError>> {
    const superposition1: Superposition<Locale, LocaleError | DataSourceError> = await this.localeCacheQuery.all();

    return superposition1.transform<Locale, LocaleError | DataSourceError>(
      (locale: Locale) => {
        return Promise.resolve<Superposition<Locale, LocaleError | DataSourceError>>(
          Alive.of<Locale, DataSourceError>(locale)
        );
      },
      async () => {
        const superposition2: Superposition<Locale, LocaleError | DataSourceError> = await this.localeAJAXQuery.all();

        return superposition2.transform<Locale, LocaleError | DataSourceError>(
          async (locale: Locale) => {
            const superposition3: Superposition<unknown, DataSourceError> = await this.localeCommand.create(locale);

            return superposition3.transform<Locale, DataSourceError>(
              () => {
                return Alive.of<Locale, DataSourceError>(locale);
              },
              (err: DataSourceError, self: Dead<unknown, DataSourceError>) => {
                return self.transpose<Locale>();
              }
            );
          },
          (err: LocaleError | DataSourceError, self: Dead<Locale, LocaleError | DataSourceError>) => {
            return Promise.resolve<Superposition<Locale, LocaleError | DataSourceError>>(self);
          }
        );
      }
    );
  }
}
