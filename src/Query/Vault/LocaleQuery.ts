import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
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
  private readonly ajaxQuery: ILocaleQuery;
  private readonly cacheQuery: ILocaleQuery;
  private readonly cacheCommand: ILocaleCommand;

  public constructor(
    @inject(Type.LocaleFetchQuery) ajaxQuery: ILocaleQuery,
    @inject(Type.LocaleCacheQuery) cacheQuery: ILocaleQuery,
    @inject(Type.LocaleCacheCommand) cacheCommand: ILocaleCommand
  ) {
    this.ajaxQuery = ajaxQuery;
    this.cacheQuery = cacheQuery;
    this.cacheCommand = cacheCommand;
  }

  public all(): Superposition<Locale, DataSourceError | LocaleError> {
    return this.cacheQuery.all().recover<Locale, DataSourceError | LocaleError>(() => {
      return this.ajaxQuery.all().map<Locale, DataSourceError | LocaleError>((locale: Locale) => {
        return this.cacheCommand.create(locale).map<Locale, DataSourceError>(() => {
          return locale;
        });
      });
    }, LocaleError, DataSourceError);
  }
}
