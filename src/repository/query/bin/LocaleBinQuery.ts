import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { ILocaleCommand } from '../../command/ILocaleCommand.js';
import { ILocaleQuery } from '../ILocaleQuery.js';
import { IBinQuery } from './IBinQuery.js';

@injectable()
export class LocaleBinQuery implements ILocaleQuery, IBinQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Bin' = 'Bin';
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
