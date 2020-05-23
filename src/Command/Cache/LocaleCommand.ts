import { inject, injectable } from 'inversify';
import { CacheError, DataSourceError, ICache, Schrodinger, Superposition } from 'publikum';

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

  public create(locale: Locale): Promise<Superposition<unknown, DataSourceError>> {
    return Promise.resolve<Superposition<unknown, CacheError>>(
      Schrodinger.playground<unknown, CacheError>(() => {
        return this.cache.set(VAULT_LOCALE_KEY, locale);
      })
    );
  }
}
