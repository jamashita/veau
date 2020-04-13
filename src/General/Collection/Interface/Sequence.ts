import { Nominative } from '../../Interface/Nominative';
import { Enumerator, Mapper, Predicate } from '../../Type/Function';
import { Optional } from '../../Optional/Optional';
import { Collection } from '../../Interface/Collection';
import { Cloneable } from '../../Interface/Cloneable';

export interface Sequence<E extends Nominative> extends Collection<number, E>, Cloneable {
  readonly noun: string;

  add(...elements: Array<E>): Sequence<E>;

  // TODO set(element: E): Sequence<E>;
  // TODO remove(element: E): Sequence<E>;

  forEach(iteration: Mapper<E, void>): void;

  map<F extends Nominative>(mapper: Mapper<E, F>): Sequence<F>;

  find(predicate: Predicate<E>): Optional<E>;

  filter(iterator: Enumerator<number, E>): Sequence<E>;

  every(enumerator: Enumerator<number, E>): boolean;

  some(enumerator: Enumerator<number, E>): boolean;

  copy(): Sequence<E>;

  toArray(): Array<E>;
}
