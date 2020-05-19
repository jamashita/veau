import { inject, injectable } from 'inversify';
import { CacheError, DataSourceError, ICache, Schrodinger, Superposition } from 'publikum';

import { TYPE } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { Locale } from '../../VO/Locale/Locale';
import { ICacheCommand } from './Interface/ICacheCommand';
import { ILocaleCommand } from '../Interface/ILocaleCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand, ICacheCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(TYPE.Cache) cache: ICache) {
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
