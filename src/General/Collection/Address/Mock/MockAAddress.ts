import { Nominative } from '../../../Interface/Nominative';
import { UnimplementedError } from '../../../UnimplementedError';
import { AAddress } from '../Abstract/AAddress';
import { Address } from '../Interface/Address';

export class MockAAddress<E extends Nominative> extends AAddress<E> implements Address<E> {
  public readonly noun: 'MockAAddress' = 'MockAAddress';

  public constructor(elements: Set<E>) {
    super(elements);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(...elements: Array<E>): Address<E> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public remove(element: E): Address<E> {
    throw new UnimplementedError();
  }

  public copy(): Address<E> {
    throw new UnimplementedError();
  }
}
