import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { HeapError } from '../../veau-general/Heap/HeapError';
import { IHeap } from '../../veau-general/Heap/interfaces/IHeap';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { VAULT_LOCALE_KEY } from '../../veau-infrastructure/VeauVault';
import { Locale } from '../../veau-vo/Locale';
import { IHeapQuery } from '../Interfaces/IHeapQuery';
import { ILocaleQuery } from '../Interfaces/ILocaleQuery';

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
