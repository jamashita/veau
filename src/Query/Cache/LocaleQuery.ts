import { CacheError, ICache } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { ICacheQuery } from './Interface/ICacheQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery<CacheError>, ICacheQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(Type.Cache) cache: ICache) {
    this.cache = cache;
  }

  public all(): Superposition<Locale, CacheError | LocaleError> {
    return Superposition.playground<Locale, CacheError>(() => {
      return this.cache.get<Locale>(VAULT_LOCALE_KEY);
    }, CacheError);
  }
}
