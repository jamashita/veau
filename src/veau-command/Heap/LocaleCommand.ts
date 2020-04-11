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
import { IHeapCommand } from '../Interface/IHeapCommand';
import { ILocaleCommand } from '../Interface/ILocaleCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand, IHeapCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Heap' = 'Heap';
  private readonly heap: IHeap;

  public constructor(@inject(TYPE.Vault) heap: IHeap) {
    this.heap = heap;
  }

  public create(locale: Locale): Promise<Try<void, DataSourceError>> {
    try {
      this.heap.set(VAULT_LOCALE_KEY, locale);

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.resolve<Try<void, DataSourceError>>(Success.of<void, DataSourceError>(undefined));
    }
    catch (err) {
      if (err instanceof HeapError) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return Promise.resolve<Try<void, HeapError>>(Failure.of<void, HeapError>(err));
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.reject<Try<void, DataSourceError>>(err);
    }
  }
}
