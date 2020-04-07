import { UnimplementedError } from '../../UnimplementedError';
import { IHeap } from '../interfaces/IHeap';

export class MockHeap<T> implements IHeap<T> {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set(value: T): void {
    throw new UnimplementedError();
  }

  public get(): T {
    throw new UnimplementedError();
  }
}
