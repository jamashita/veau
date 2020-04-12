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
      return Promise.resolve<Try<void, DataSourceError>>(Success.of<DataSourceError>());
    }
    catch (err) {
      if (err instanceof HeapError) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return Promise.resolve<Try<void, HeapError>>(Failure.of<HeapError>(err));
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return Promise.reject<Try<void, DataSourceError>>(err);
    }
  }
}
