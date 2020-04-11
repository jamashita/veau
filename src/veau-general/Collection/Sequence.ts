import { Nominative } from '../Nominative';
import { None } from '../Optional/None';
import { Optional } from '../Optional/Optional';
import { Some } from '../Optional/Some';
import { Mapper } from '../Type/Function';
import { Ambiguous } from '../Type/Value';
import { Collection } from './Collection';

export class Sequence<E extends Nominative> implements Collection<number, E>, Iterable<E> {
  public readonly noun: 'List' = 'List';
  private readonly elements: Array<E>;

  public static of<E extends Nominative>(elements: Array<E>): Sequence<E> {
    return new Sequence<E>(elements);
  }

  public static empty<E extends Nominative>(): Sequence<E> {
    return Sequence.of([
    ]);
  }

  private constructor(elements: Array<E>) {
    this.elements = elements;
  }

  public [Symbol.iterator](): IterableIterator<E> {
    return this.elements[Symbol.iterator]();
  }

  public add(...elements: Array<E>): Sequence<E> {
    return Sequence.of<E>([
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
    if (this.elements.length === 0) {
      return true;
    }

    return false;
  }

  public iterate(iteration: Mapper<E, void>): void {
    this.elements.forEach(iteration);
  }

  public project<F extends Nominative>(mapper: Mapper<E, F>): Sequence<F> {
    return Sequence.of(this.elements.map<F>(mapper));
  }

  public equals(other: Sequence<E>): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.elements.length;
    if (length !== other.size()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.elements[i].equals(other.elements[i])) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return this.elements.map<string>((element: E) => {
      return element.toString();
    }).join(', ');
  }

  public toArray(): Array<E> {
    return [
      ...this.elements
    ];
  }
}
