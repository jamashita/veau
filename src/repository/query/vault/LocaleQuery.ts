import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { ILocaleCommand } from '../../command/interface/ILocaleCommand';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IVaultQuery } from './interface/IVaultQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IVaultQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly ajaxQuery: ILocaleQuery;
  private readonly cacheQuery: ILocaleQuery;
  private readonly cacheCommand: ILocaleCommand;

  public constructor(
    @inject(Type.LocaleFetchQuery) ajaxQuery: ILocaleQuery,
    @inject(Type.LocaleHeapQuery) cacheQuery: ILocaleQuery,
    @inject(Type.LocaleHeapCommand) cacheCommand: ILocaleCommand
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
