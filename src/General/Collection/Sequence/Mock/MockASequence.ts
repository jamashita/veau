import { Nominative } from '../../../Interface/Nominative';
import { Enumerator, Mapper } from '../../../Type/Function';
import { UnimplementedError } from '../../../UnimplementedError';
import { ASequence } from '../Abstract/ASequence';
import { ImmutableSequence } from '../ImmutableSequence';
import { Sequence } from '../Interface/Sequence';

export class MockASequence<E extends Nominative> extends ASequence<E> {

  public constructor(elements: Array<E>) {
    super(elements);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(...elements: Array<E>): Sequence<E> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<F extends Nominative>(mapper: Mapper<E, F>): Sequence<F> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(iterator: Enumerator<number, E>): ImmutableSequence<E> {
    throw new UnimplementedError();
  }

  public copy(): Sequence<E> {
    throw new UnimplementedError();
  }
}
