import { Nominative } from '../../../Interface/Nominative';
import { None } from '../../../Optional/None';
import { Optional } from '../../../Optional/Optional';
import { Some } from '../../../Optional/Some';
import { Enumerator, Mapper, Predicate } from '../../../Type/Function';
import { Ambiguous } from '../../../Type/Value';
import { ImmutableSequence } from '../ImmutableSequence';
import { Sequence } from '../Interface/Sequence';

export abstract class ASequence<E extends Nominative> implements Sequence<E> {
  public abstract readonly noun: string;
  private readonly elements: Array<E>;

  protected constructor(elements: Array<E>) {
    this.elements = elements;
  }

  public abstract add(...elements: Array<E>): Sequence<E>;

  public abstract map<F extends Nominative>(mapper: Mapper<E, F>): Sequence<F>;

  public abstract filter(iterator: Enumerator<number, E>): ImmutableSequence<E>;

  public get(index: number): Optional<E> {
    const element: Ambiguous<E> = this.elements[index];

    if (element === undefined) {
      return None.of<E>();
    }

    return Some.of<E>(element);
  }

  public contains(value: E): boolean {
    const found: Ambiguous<E> = this.elements.find((element: E) => {
      return value.equals(element);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.elements.length;
  }

  public isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }

    return false;
  }

  public forEach(iteration: Mapper<E, void>): void {
    this.elements.forEach(iteration);
  }

  public find(predicate: Predicate<E>): Optional<E> {
    const element: Ambiguous<E> =  this.elements.find(predicate);

    if (element === undefined) {
      return None.of<E>();
    }

    return Some.of<E>(element);
  }

  public every(enumerator: Enumerator<number, E>): boolean {
    return this.elements.every(enumerator);
  }

  public some(enumerator: Enumerator<number, E>): boolean {
    return this.elements.some(enumerator);
  }

  public copy(): ImmutableSequence<E> {
    return ImmutableSequence.of<E>([
      ...this.elements
    ]);
  }

  public equals(other: ASequence<E>): boolean {
    if (this === other) {
      return true;
    }
    if (this.elements.length !== other.elements.length) {
      return false;
    }

    return this.elements.every((element: E, index: number) => {
      return element.equals(other.elements[index]);
    });
  }

  public toArray(): Array<E> {
    return [
      ...this.elements
    ];
  }

  public toString(): string {
    return this.elements.map<string>((element: E) => {
      return element.toString();
    }).join(', ');
  }
}
