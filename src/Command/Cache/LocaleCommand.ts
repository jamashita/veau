import { inject, injectable } from 'inversify';
import { Alive, CacheError, DataSourceError, Dead, ICache, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { Locale } from '../../VO/Locale';
import { ICacheCommand } from '../Interface/ICacheCommand';
import { ILocaleCommand } from '../Interface/ILocaleCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand, ICacheCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(TYPE.Cache) cache: ICache) {
    this.cache = cache;
  }

  public create(locale: Locale): Promise<Superposition<void, DataSourceError>> {
    try {
      this.cache.set(VAULT_LOCALE_KEY, locale);

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.resolve<Superposition<void, DataSourceError>>(Alive.of<DataSourceError>());
    }
    catch (err) {
      if (err instanceof CacheError) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return Promise.resolve<Superposition<void, CacheError>>(Dead.of<CacheError>(err));
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.reject<Superposition<void, DataSourceError>>(err);
    }
  }
}
