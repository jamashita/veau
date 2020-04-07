import { HeapError } from './HeapError';
import { IHeap } from './interfaces/IHeap';

export class Heap<T> implements IHeap<T> {
  private value: T | null;

  public constructor() {
    this.value = null;
  }

  public set(value: T): void {
    this.value = value;
  }

  public get(): T {
    if (this.value === null) {
      throw new HeapError('NOT EXIST');
    }

    return this.value;
  }
}
