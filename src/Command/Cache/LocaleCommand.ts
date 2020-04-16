import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { CacheError } from '../../General/Cache/CacheError';
import { ICache } from '../../General/Cache/Interface/ICache';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Try } from '../../General/Superposition/Try';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { Locale } from '../../VO/Locale';
import { ICacheCommand } from '../Interface/ICacheCommand';
import { ILocaleCommand } from '../Interface/ILocaleCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand, ICacheCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(TYPE.Vault) cache: ICache) {
    this.cache = cache;
  }

  public create(locale: Locale): Promise<Try<void, DataSourceError>> {
    try {
      this.cache.set(VAULT_LOCALE_KEY, locale);

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.resolve<Try<void, DataSourceError>>(Success.of<DataSourceError>());
    }
    catch (err) {
      if (err instanceof CacheError) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return Promise.resolve<Try<void, CacheError>>(Failure.of<CacheError>(err));
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.reject<Try<void, DataSourceError>>(err);
    }
  }
}
