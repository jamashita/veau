import { Cloneable } from '../../../Interface/Cloneable';
import { Nominative } from '../../../Interface/Nominative';
import { Quantum } from '../../../Quantum/Quantum';
import { Enumerator, Mapper, Predicate } from '../../../Type/Function';
import { Collection } from '../../Interface/Collection';

export interface Sequence<E extends Nominative> extends Collection<number, E>, Cloneable<Sequence<E>> {

  add(...elements: Array<E>): Sequence<E>;

  // TODO set(element: E): Sequence<E>;
  // TODO remove(element: E): Sequence<E>;

  forEach(iteration: Mapper<E, void>): void;

  map<F extends Nominative>(mapper: Mapper<E, F>): Sequence<F>;

  find(predicate: Predicate<E>): Quantum<E>;

  filter(iterator: Enumerator<number, E>): Sequence<E>;

  every(enumerator: Enumerator<number, E>): boolean;

  some(enumerator: Enumerator<number, E>): boolean;

  toArray(): Array<E>;
}
