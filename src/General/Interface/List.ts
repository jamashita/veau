import { Collection } from './Collection';
import { Nominative } from './Nominative';
import { Cloneable } from './Cloneable';
import { Enumerator, Mapper, Predicate } from '../Type/Function';
import { Optional } from '../Optional/Optional';

export interface List<E extends Nominative> extends Collection<number, E>, Cloneable {

  iterate(iteration: Mapper<E, void>): void;

  project<F extends Nominative>(mapper: Mapper<E, F>): ThisType<F>;

  select(predicate: Predicate<E>): Optional<E>;

  screen(iterator: Enumerator<number, E>): ThisType<E>;

  every(enumerator: Enumerator<number, E>): boolean;

  some(enumerator: Enumerator<number, E>): boolean;

  toArray(): Array<E>;
}
