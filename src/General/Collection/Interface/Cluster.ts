import { Nominative } from '../../Interface/Nominative';
import { Collection } from '../../Interface/Collection';
import { Cloneable } from '../../Interface/Cloneable';
import { Enumerator } from '../../Type/Function';

export interface Cluster<K, V extends Nominative> extends Collection<K, V>, Cloneable {

  set(key: K, value: V): Cluster<K, V>;

  remove(key: K): Cluster<K, V>;

  keys(): Set<K>;

  values(): Set<Set<V>>;

  forEach(iteration: Enumerator<K, V>): void;

  copy(): Cluster<K, V>;
}
