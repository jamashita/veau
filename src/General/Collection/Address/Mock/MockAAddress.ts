import { Nominative } from '../../../Interface/Nominative';
import { None } from '../../../Quantum/None';
import { Quantum } from '../../../Quantum/Quantum';
import { Some } from '../../../Quantum/Some';
import { Enumerator, Predicate } from '../../../Type/Function';
import { Ambiguous } from '../../../Type/Value';
import { UnimplementedError } from '../../../UnimplementedError';
import { AAddress } from '../Abstract/AAddress';
import { Address } from '../Interface/Address';

export class MockAAddress<E extends Nominative> extends AAddress<E> implements Address<E>  {
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
