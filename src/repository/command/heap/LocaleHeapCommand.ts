import { HeapError, IHeap } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { VAULT_LOCALE_KEY } from '../../../infrastructure/VeauHeap';
import { ILocaleCommand } from '../interface/ILocaleCommand';
import { IHeapCommand } from './IHeapCommand';

@injectable()
export class LocaleHeapCommand implements ILocaleCommand<HeapError>, IHeapCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Heap' = 'Heap';
  private readonly Heap: IHeap;

  public constructor(@inject(Type.Heap) Heap: IHeap) {
    this.Heap = Heap;
  }

  public create(locale: Locale): Superposition<unknown, HeapError> {
    return Superposition.playground<unknown, HeapError>(() => {
      this.Heap.set(VAULT_LOCALE_KEY, locale);
    }, HeapError);
  }
}
