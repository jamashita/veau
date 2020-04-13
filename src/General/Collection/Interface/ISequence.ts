import { Nominative } from '../../Interface/Nominative';
import { Enumerator, Mapper, Predicate } from '../../Type/Function';
import { Optional } from '../../Optional/Optional';
import { Collection } from '../../Interface/Collection';
import { Cloneable } from '../../Interface/Cloneable';

export interface ISequence<E extends Nominative> extends Collection<number, E>, Cloneable {
  readonly noun: string;

  add(...elements: Array<E>): ISequence<E>;

  // TODO set(element: E): ISequence<E>;
  // TODO remove(element: E): ISequence<E>;

  forEach(iteration: Mapper<E, void>): void;

  map<F extends Nominative>(mapper: Mapper<E, F>): ISequence<F>;

  find(predicate: Predicate<E>): Optional<E>;

  filter(iterator: Enumerator<number, E>): ISequence<E>;

  every(enumerator: Enumerator<number, E>): boolean;

  some(enumerator: Enumerator<number, E>): boolean;

  toArray(): Array<E>;
}
