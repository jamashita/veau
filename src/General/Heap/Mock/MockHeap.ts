import { UnimplementedError } from '../../UnimplementedError';
import { IHeap } from '../Interface/IHeap';

export class MockHeap implements IHeap {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set(identifier: symbol, value: unknown): void {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get<H>(identifier: symbol): H {
    throw new UnimplementedError();
  }
}
