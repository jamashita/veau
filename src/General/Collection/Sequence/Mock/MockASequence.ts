import { Objet } from '../../../Object/Objet';
import { Enumerator, Mapper } from '../../../Type/Function';
import { UnimplementedError } from '../../../UnimplementedError';
import { ASequence } from '../Abstract/ASequence';
import { ImmutableSequence } from '../ImmutableSequence';
import { Sequence } from '../Interface/Sequence';

export class MockASequence<E extends Objet> extends ASequence<E> implements Sequence<E> {
  public readonly noun: 'MockASequence' = 'MockASequence';

  public constructor(elements: Array<E>) {
    super(elements);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(...elements: Array<E>): Sequence<E> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<F extends Objet>(mapper: Mapper<E, F>): Sequence<F> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(iterator: Enumerator<number, E>): ImmutableSequence<E> {
    throw new UnimplementedError();
  }

  public duplicate(): Sequence<E> {
    throw new UnimplementedError();
  }
}
