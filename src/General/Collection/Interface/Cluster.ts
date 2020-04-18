import { Cloneable } from '../../Interface/Cloneable';
import { Objet } from '../../Object/Objet';
import { Enumerator } from '../../Type/Function';
import { Collection } from './Collection';

export interface Cluster<K, V extends Objet> extends Collection<K, V>, Cloneable<Cluster<K, V>> {

  set(key: K, value: V): Cluster<K, V>;

  remove(key: K): Cluster<K, V>;

  keys(): Set<K>;

  values(): Set<Set<V>>;

  forEach(iteration: Enumerator<K, V>): void;
}
