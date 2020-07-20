import { CacheError, ICache } from '@jamashita/publikum-cache';
import { Superposition } from '@jamashita/publikum-monad';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { ICacheCommand } from './Interface/ICacheCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand<CacheError>, ICacheCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(Type.Cache) cache: ICache) {
    this.cache = cache;
  }

  public create(locale: Locale): Superposition<unknown, CacheError> {
    return Superposition.playground<unknown, CacheError>(() => {
      return this.cache.set(VAULT_LOCALE_KEY, locale);
    }, CacheError);
  }
}
