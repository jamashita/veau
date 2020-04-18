import { Objet } from '../../../Object/Objet';
import { Absent } from '../../../Quantum/Absent';
import { Present } from '../../../Quantum/Present';
import { Quantum } from '../../../Quantum/Quantum';
import { Enumerator, Mapper, Predicate } from '../../../Type/Function';
import { Ambiguous } from '../../../Type/Value';
import { ImmutableSequence } from '../ImmutableSequence';
import { Sequence } from '../Interface/Sequence';

export abstract class ASequence<E extends Objet> extends Objet implements Sequence<E> {
  public abstract readonly noun: string;
  protected readonly elements: Array<E>;

  protected constructor(elements: Array<E>) {
    super();
    this.elements = elements;
  }

  public abstract add(...elements: Array<E>): Sequence<E>;

  public abstract map<F extends Objet>(mapper: Mapper<E, F>): Sequence<F>;

  public abstract filter(iterator: Enumerator<number, E>): ImmutableSequence<E>;

  public abstract duplicate(): Sequence<E>;

  public get(index: number): Quantum<E> {
    const element: Ambiguous<E> = this.elements[index];

    if (element === undefined) {
      return Absent.of<E>();
    }

    return Present.of<E>(element);
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

  public find(predicate: Predicate<E>): Quantum<E> {
    const element: Ambiguous<E> = this.elements.find(predicate);

    if (element === undefined) {
      return Absent.of<E>();
    }

    return Present.of<E>(element);
  }

  public every(enumerator: Enumerator<number, E>): boolean {
    return this.elements.every(enumerator);
  }

  public some(enumerator: Enumerator<number, E>): boolean {
    return this.elements.some(enumerator);
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

  public serialize(): string {
    return this.elements.map<string>((element: E) => {
      return element.toString();
    }).join(', ');
  }
}
