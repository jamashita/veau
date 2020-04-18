import { Cloneable } from '../../Interface/Cloneable';
import { Nominative } from '../../Interface/Nominative';
import { Enumerator } from '../../Type/Function';
import { Collection } from './Collection';

export interface Project<K, V extends Nominative> extends Collection<K, V>, Cloneable<Project<K, V>> {

  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  keys(): Set<K>;

  values(): Set<V>;

  forEach(iteration: Enumerator<K, V>): void;

  duplicate(): Project<K, V>;
}
