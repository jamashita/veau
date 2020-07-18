import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

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

  public all(): Superposition<Locale, LocaleError | DataSourceError> {
    return this.localeCacheQuery.all().recover<Locale, LocaleError | DataSourceError>(
      () => {
        return this.localeAJAXQuery.all().map<Locale, LocaleError | DataSourceError>((locale: Locale) => {
          return this.localeCommand.create(locale).map<Locale, DataSourceError>(() => {
            return locale;
          });
        });
      },
      LocaleError,
      DataSourceError
    );
  }
}
