import { Cloneable } from '../../Interface/Cloneable';
import { Nominative } from '../../Interface/Nominative';
import { Enumerator } from '../../Type/Function';
import { Collection } from './Collection';

export interface Cluster<K, V extends Nominative> extends Collection<K, V>, Cloneable<Cluster<K, V>> {

  set(key: K, value: V): Cluster<K, V>;

  remove(key: K): Cluster<K, V>;

  keys(): Set<K>;

  values(): Set<Set<V>>;

  forEach(iteration: Enumerator<K, V>): void;
}
