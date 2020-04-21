import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { CacheError } from '../../General/Cache/CacheError';
import { ICache } from '../../General/Cache/Interface/ICache';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { Locale } from '../../VO/Locale';
import { ICacheQuery } from '../Interface/ICacheQuery';
import { ILocaleQuery } from '../Interface/ILocaleQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, ICacheQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(TYPE.Cache) cache: ICache) {
    this.cache = cache;
  }

  public all(): Promise<Superposition<Locale, DataSourceError>> {
    try {
      const locale: Locale = this.cache.get<Locale>(VAULT_LOCALE_KEY);

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.resolve<Superposition<Locale, DataSourceError>>(Success.of<Locale, DataSourceError>(locale));
    }
    catch (err) {
      if (err instanceof CacheError) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return Promise.resolve<Superposition<Locale, CacheError>>(Failure.of<Locale, CacheError>(err));
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.reject<Superposition<Locale, CacheError>>(err);
    }
  }
}
