import { inject, injectable } from 'inversify';

import { CacheError, ICache } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { ICacheCommand } from './Interface/ICacheCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand, ICacheCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(Type.Cache) cache: ICache) {
    this.cache = cache;
  }

  public create(locale: Locale): Superposition<unknown, DataSourceError> {
    return Superposition.playground<unknown, CacheError>(() => {
      return this.cache.set(VAULT_LOCALE_KEY, locale);
    });
  }
}
