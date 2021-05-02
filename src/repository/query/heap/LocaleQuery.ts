import { HeapError, IHeap } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { VAULT_LOCALE_KEY } from '../../../infrastructure/VeauHeap';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IHeapQuery } from './IHeapQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery<HeapError>, IHeapQuery {
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
