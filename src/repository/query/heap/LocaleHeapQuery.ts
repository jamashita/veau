import { HeapError, IHeap } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { VAULT_LOCALE_KEY } from '../../../infrastructure/VeauHeap.js';
import { ILocaleQuery } from '../ILocaleQuery.js';
import { IHeapQuery } from './IHeapQuery.js';

@injectable()
export class LocaleHeapQuery implements ILocaleQuery<HeapError>, IHeapQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Heap' = 'Heap';
  private readonly Heap: IHeap;

  public constructor(@inject(Type.Heap) Heap: IHeap) {
    this.Heap = Heap;
  }

  public all(): Superposition<Locale, HeapError | LocaleError> {
    return Superposition.playground<Locale, HeapError>(() => {
      return this.Heap.get<Locale>(VAULT_LOCALE_KEY);
    }, HeapError);
  }
}
