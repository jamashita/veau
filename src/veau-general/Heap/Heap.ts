import { HeapError } from './HeapError';
import { IHeap } from './interfaces/IHeap';

export class Heap implements IHeap {
  private readonly values: Map<symbol, unknown>;

  public constructor() {
    this.values = new Map<symbol, unknown>();
  }

  public set(identifier: symbol, value: unknown): void {
    this.values.set(identifier, value);
  }

  public get<H>(identifier: symbol): H {
    const instance: unknown | undefined = this.values.get(identifier);

    if (instance === undefined) {
      throw new HeapError('NOT EXIST');
    }

    return instance as H;
  }
}
