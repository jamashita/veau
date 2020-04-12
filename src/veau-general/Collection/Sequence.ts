import { Nominative } from '../Nominative';
import { None } from '../Optional/None';
import { Optional } from '../Optional/Optional';
import { Some } from '../Optional/Some';
import { Enumerator, Mapper, Predicate } from '../Type/Function';
import { Ambiguous } from '../Type/Value';
import { List } from './Interface/List';

export class Sequence<E extends Nominative> implements List<E> {
  public readonly noun: 'Sequence' = 'Sequence';
  private readonly elements: Array<E>;

  private static readonly EMPTY: Sequence<Nominative> = new Sequence<Nominative>([
  ]);

  public static of<E extends Nominative>(elements: Array<E>): Sequence<E> {
    if (elements.length === 0) {
      return Sequence.empty<E>();
    }

    return new Sequence<E>(elements);
  }

  public static empty<E extends Nominative>(): Sequence<E> {
    return Sequence.EMPTY as Sequence<E>;
  }

  protected constructor(elements: Array<E>) {
    this.elements = elements;
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
    if (this.isEmpty()) {
      return Sequence.empty<F>();
    }

    return Sequence.of<F>(this.elements.map<F>(mapper));
  }

  public select(predicate: Predicate<E>): Optional<E> {
    const element: E  | undefined =  this.elements.find(predicate);

    if (element === undefined) {
      return None.of<E>();
    }

    return Some.of<E>(element);
  }

  public screen(iterator: Enumerator<number, E>): Sequence<E> {
    const filtered: Array<E> = this.elements.filter(iterator);

    if (filtered.length === 0) {
      return Sequence.empty<E>();
    }

    return Sequence.of<E>(filtered);
  }

  public every(enumerator: Enumerator<number, E>): boolean {
    return this.elements.every(enumerator);
  }

  public some(enumerator: Enumerator<number, E>): boolean {
    return this.elements.some(enumerator);
  }

  public copy(): Sequence<E> {
    return Sequence.of<E>([
      ...this.elements
    ]);
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
