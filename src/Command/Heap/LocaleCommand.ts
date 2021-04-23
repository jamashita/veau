import { HeapError, ICache } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauCache';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { ICacheCommand } from './Interface/ICacheCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand<HeapError>, ICacheCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Cache' = 'Cache';
  private readonly cache: ICache;

  public constructor(@inject(Type.Heap) cache: ICache) {
    this.cache = cache;
  }

  public create(locale: Locale): Superposition<unknown, HeapError> {
    return Superposition.playground<unknown, HeapError>(() => {
      return this.cache.set(VAULT_LOCALE_KEY, locale);
    }, HeapError);
  }
}
