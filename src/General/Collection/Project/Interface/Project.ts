import { Cloneable } from '../../Interface/Cloneable';
import { Objet } from '../../Object/Objet';
import { Enumerator } from '../../Type/Function';
import { Collection } from './Collection';

export interface Project<K, V extends Objet> extends Collection<K, V>, Cloneable<Project<K, V>> {

  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  keys(): Set<K>;

  values(): Set<V>;

  forEach(iteration: Enumerator<K, V>): void;
}
