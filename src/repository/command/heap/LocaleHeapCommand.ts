import { HeapError, IHeap } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { VAULT_LOCALE_KEY } from '../../../infrastructure/VeauHeap.js';
import { ILocaleCommand } from '../ILocaleCommand.js';
import { IHeapCommand } from './IHeapCommand.js';

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
