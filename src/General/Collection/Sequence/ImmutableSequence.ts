import { Objet } from '../../Object/Objet';
import { Enumerator, Mapper } from '../../Type/Function';
import { ASequence } from './Abstract/ASequence';
import { Sequence } from './Interface/Sequence';

export class ImmutableSequence<E extends Objet> extends ASequence<E> implements Sequence<E> {
  public readonly noun: 'ImmutableSequence' = 'ImmutableSequence';

  private static readonly EMPTY: ImmutableSequence<Objet> = new ImmutableSequence<Objet>([]);

  public static of<E extends Objet>(elements: Array<E>): ImmutableSequence<E> {
    if (elements.length === 0) {
      return ImmutableSequence.empty<E>();
    }

    return new ImmutableSequence<E>(elements);
  }

  public static empty<E extends Objet>(): ImmutableSequence<E> {
    return ImmutableSequence.EMPTY as ImmutableSequence<E>;
  }

  protected constructor(elements: Array<E>) {
    super(elements);
  }

  public add(...elements: Array<E>): ImmutableSequence<E> {
    if (elements.length === 0) {
      return this;
    }

    return ImmutableSequence.of<E>([
      ...this.elements,
      ...elements
    ]);
  }

  public isEmpty(): boolean {
    if (this === ImmutableSequence.empty<E>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<F extends Objet>(mapper: Mapper<E, F>): ImmutableSequence<F> {
    return ImmutableSequence.of<F>(this.elements.map<F>(mapper));
  }

  public filter(iterator: Enumerator<number, E>): ImmutableSequence<E> {
    return ImmutableSequence.of<E>(this.elements.filter(iterator));
  }

  public duplicate(): ImmutableSequence<E> {
    return ImmutableSequence.of<E>([
      ...this.elements
    ]);
  }
}
