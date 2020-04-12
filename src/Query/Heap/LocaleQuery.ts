import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { DataSourceError } from '../../General/DataSourceError';
import { HeapError } from '../../General/Heap/HeapError';
import { IHeap } from '../../General/Heap/Interface/IHeap';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauVault';
import { Locale } from '../../VO/Locale';
import { IHeapQuery } from '../Interface/IHeapQuery';
import { ILocaleQuery } from '../Interface/ILocaleQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IHeapQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Heap' = 'Heap';
  private readonly heap: IHeap;

  public constructor(@inject(TYPE.Vault) heap: IHeap) {
    this.heap = heap;
  }


  public all(): Promise<Try<Locale, DataSourceError>> {
    try {
      const locale: Locale = this.heap.get<Locale>(VAULT_LOCALE_KEY);

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.resolve<Try<Locale, DataSourceError>>(Success.of<Locale, DataSourceError>(locale));
    }
    catch (err) {
      if (err instanceof HeapError) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return Promise.resolve<Try<Locale, HeapError>>(Failure.of<Locale, HeapError>(err));
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.reject<Try<Locale, HeapError>>(err);
    }
  }
}
