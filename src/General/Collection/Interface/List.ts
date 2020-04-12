import { Collection } from '../../Interface/Collection';
import { Nominative } from '../../Interface/Nominative';
import { Cloneable } from '../../Interface/Cloneable';
import { Enumerator, Mapper, Predicate } from '../../Type/Function';
import { Optional } from '../../Optional/Optional';

export interface List<E extends Nominative> extends Collection<number, E>, Cloneable {

  iterate(iteration: Mapper<E, void>): void;

  project<F extends Nominative>(mapper: Mapper<E, F>): List<F>;

  select(predicate: Predicate<E>): Optional<E>;

  screen(iterator: Enumerator<number, E>): List<E>;

  every(enumerator: Enumerator<number, E>): boolean;

  some(enumerator: Enumerator<number, E>): boolean;

  toArray(): Array<E>;
}
