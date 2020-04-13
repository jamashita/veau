import { Nominative } from '../Interface/Nominative';
import { None } from '../Optional/None';
import { Optional } from '../Optional/Optional';
import { Some } from '../Optional/Some';
import { Enumerator, Mapper, Predicate } from '../Type/Function';
import { Ambiguous } from '../Type/Value';
import { Sequence } from './Interface/Sequence';

export class ArraySequence<E extends Nominative> implements Sequence<E> {
  public readonly noun: 'ArraySequence' = 'ArraySequence';
  private readonly elements: Array<E>;

  private static readonly EMPTY: ArraySequence<Nominative> = new ArraySequence<Nominative>([]);

  public static of<E extends Nominative>(elements: Array<E>): ArraySequence<E> {
    if (elements.length === 0) {
      return ArraySequence.empty<E>();
    }

    return new ArraySequence<E>(elements);
  }

  public static empty<E extends Nominative>(): ArraySequence<E> {
    return ArraySequence.EMPTY as ArraySequence<E>;
  }

  protected constructor(elements: Array<E>) {
    this.elements = elements;
  }

  public add(...elements: Array<E>): ArraySequence<E> {
    return ArraySequence.of<E>([
      ...this.elements,
      ...elements
    ]);
  }

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
    if (this === ArraySequence.empty<E>()) {
      return true;
    }

    return false;
  }

  public forEach(iteration: Mapper<E, void>): void {
    this.elements.forEach(iteration);
  }

  public map<F extends Nominative>(mapper: Mapper<E, F>): ArraySequence<F> {
    return ArraySequence.of<F>(this.elements.map<F>(mapper));
  }

  public find(predicate: Predicate<E>): Optional<E> {
    const element: Ambiguous<E> =  this.elements.find(predicate);

    if (element === undefined) {
      return None.of<E>();
    }

    return Some.of<E>(element);
  }

  public filter(iterator: Enumerator<number, E>): ArraySequence<E> {
    return ArraySequence.of<E>(this.elements.filter(iterator));
  }

  public every(enumerator: Enumerator<number, E>): boolean {
    return this.elements.every(enumerator);
  }

  public some(enumerator: Enumerator<number, E>): boolean {
    return this.elements.some(enumerator);
  }

  public copy(): ArraySequence<E> {
    return ArraySequence.of<E>([
      ...this.elements
    ]);
  }

  public equals(other: ArraySequence<E>): boolean {
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
