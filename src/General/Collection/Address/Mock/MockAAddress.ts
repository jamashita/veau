import { Objet } from '../../../Object/Objet';
import { UnimplementedError } from '../../../UnimplementedError';
import { AAddress } from '../Abstract/AAddress';
import { Address } from '../Interface/Address';

export class MockAAddress<E extends Objet> extends AAddress<E> implements Address<E> {
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

  public duplicate(): Address<E> {
    throw new UnimplementedError();
  }
}
