import { Cloneable } from '../../../Interface/Cloneable';
import { Collection } from '../../../Interface/Collection';
import { Nominative } from '../../../Interface/Nominative';
import { Quantum } from '../../../Quantum/Quantum';
import { Enumerator, Predicate } from '../../../Type/Function';

export interface Address<E extends Nominative> extends Collection<void, E>, Cloneable {

  add(...elements: Array<E>): Address<E>;

  remove(element: E): Address<E>;

  forEach(iteration: Enumerator<unknown, E>): void;

  find(predicate: Predicate<E>): Quantum<E>;

  every(enumerator: Enumerator<unknown, E>): boolean;

  some(enumerator: Enumerator<unknown, E>): boolean;

  copy(): Address<E>;

  toArray(): Array<E>;
}
