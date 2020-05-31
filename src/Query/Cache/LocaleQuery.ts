import { inject, injectable } from 'inversify';

import { CacheError, ICache } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { ICacheQuery } from './Interface/ICacheQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, ICacheQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(Type.Cache) cache: ICache) {
    this.cache = cache;
  }

  public all(): Promise<Superposition<Locale, LocaleError | DataSourceError>> {
    return Promise.resolve<Superposition<Locale, CacheError>>(
      Schrodinger.playground<Locale, CacheError>(() => {
        return this.cache.get<Locale>(VAULT_LOCALE_KEY);
      })
    );
  }
}
