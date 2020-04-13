import { Enumerator } from '../../Type/Function';
import { Collection } from '../../Interface/Collection';
import { Cloneable } from '../../Interface/Cloneable';
import { Nominative } from '../../Interface/Nominative';

export interface Address<E extends Nominative> extends Collection<void, E>, Cloneable {

  add(...elements: Array<E>): Address<E>;

  remove(elements: E): Address<E>;

  values(): Set<E>;

  forEach(iteration: Enumerator<number, E>): void;

  copy(): Address<E>;

  toArray(): Array<E>;
}
