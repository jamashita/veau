import { Nominative } from '../../../Interface/Nominative';
import { None } from '../../../Quantum/None';
import { Quantum } from '../../../Quantum/Quantum';
import { Some } from '../../../Quantum/Some';
import { Enumerator, Predicate } from '../../../Type/Function';
import { Ambiguous } from '../../../Type/Value';
import { Address } from '../Interface/Address';

export abstract class AAddress<E extends Nominative> implements Address<E> {
  public abstract readonly noun: string;
  protected readonly elements: Set<E>;

  protected constructor(elements: Set<E>) {
    this.elements = elements;
  }

  public abstract add(...elements: Array<E>): Address<E>;

  public abstract remove(element: E): Address<E>;

  public abstract copy(): Address<E>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get(key: void): Quantum<E> {
    return None.of<E>();
  }

  public contains(value: E): boolean {
    if (this.elements.has(value)) {
      return true;
    }

    return this.some((element: E) => {
      return value.equals(element);
    });
  }

  public size(): number {
    return this.elements.size;
  }

  public isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }

    return false;
  }

  public forEach(iteration: Enumerator<unknown, E>): void {
    this.elements.forEach(iteration);
  }

  public find(predicate: Predicate<E>): Quantum<E> {
    const element: Ambiguous<E> = this.toArray().find(predicate);

    if (element === undefined) {
      return None.of<E>();
    }

    return Some.of<E>(element);
  }

  public every(enumerator: Enumerator<unknown, E>): boolean {
    return this.toArray().every(enumerator);
  }

  public some(enumerator: Enumerator<unknown, E>): boolean {
    return this.toArray().some(enumerator);
  }

  public equals(other: AAddress<E>): boolean {
    if (this === other) {
      return true;
    }
    if (this.elements.size !== other.elements.size) {
      return false;
    }

    return this.every((element: E) => {
      return other.contains(element);
    });
  }


  public toArray(): Array<E> {
    return [
      ...this.elements
    ];
  }

  public toString(): string {
    return this.toArray().map<string>((element: E) => {
      return element.toString();
    }).join(', ');
  }
}
