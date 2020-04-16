import { Cloneable } from '../../../Interface/Cloneable';
import { Collection } from '../../../Interface/Collection';
import { Nominative } from '../../../Interface/Nominative';
import { Enumerator } from '../../../Type/Function';

export interface Address<E extends Nominative> extends Collection<void, E>, Cloneable {

  add(...elements: Array<E>): Address<E>;

  remove(elements: E): Address<E>;

  values(): Set<E>;

  forEach(iteration: Enumerator<number, E>): void;

  copy(): Address<E>;

  toArray(): Array<E>;
}
