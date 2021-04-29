import { HeapError, IHeap } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { VAULT_LOCALE_KEY } from '../../Infrastructure/VeauHeap';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleCommand } from '../Interface/ILocaleCommand';
import { IHeapCommand } from './Interface/IHeapCommand';

@injectable()
export class LocaleCommand implements ILocaleCommand<HeapError>, IHeapCommand {
  public readonly noun: 'LocaleCommand' = 'LocaleCommand';
  public readonly source: 'Heap' = 'Heap';
  private readonly Heap: IHeap;

  public constructor(@inject(Type.Heap) Heap: IHeap) {
    this.Heap = Heap;
  }

  public create(locale: Locale): Superposition<unknown, HeapError> {
    return Superposition.playground<unknown, HeapError>(() => {
      return this.Heap.set(VAULT_LOCALE_KEY, locale);
    }, HeapError);
  }
}
