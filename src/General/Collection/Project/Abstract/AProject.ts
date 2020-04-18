import { Objet } from '../../../Object/Objet';
import { Absent } from '../../../Quantum/Absent';
import { Present } from '../../../Quantum/Present';
import { Quantum } from '../../../Quantum/Quantum';
import { Enumerator } from '../../../Type/Function';
import { Ambiguous } from '../../../Type/Value';
import { Project } from '../Interface/Project';

export abstract class AProject<K extends Objet, V extends Objet> extends Objet implements Project<K, V> {
  public abstract readonly noun: string;
  protected readonly elements: Map<string, [K, V]>;

  protected constructor(elements: Map<string, [K, V]>) {
    super();
    this.elements = elements;
  }

  public abstract set(key: K, value: V): Project<K, V>;

  public abstract remove(key: K): Project<K, V>;

  public abstract duplicate(): Project<K, V>;

  public get(key: K): Quantum<V> {
    const element: Ambiguous<[K, V]> = this.elements.get(key.hashCode());

    if (element === undefined) {
      return Absent.of<V>();
    }

    return Present.of<V>(element[1]);
  }

  public has(key: K): boolean {
    return this.elements.has(key.hashCode());
  }

  public contains(value: V): boolean {
    // TODO
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

  public forEach(iteration: Enumerator<K, V>): void {
    this.elements.forEach((element: [K, V]) => {
      iteration(element[1], element[0]);
    });
  }
}
