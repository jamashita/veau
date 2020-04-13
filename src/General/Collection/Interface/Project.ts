import { Collection } from '../../Interface/Collection';
import { Cloneable } from '../../Interface/Cloneable';
import { Nominative } from '../../Interface/Nominative';
import { Enumerator } from '../../Type/Function';

export interface Project<K, V extends Nominative> extends Collection<K, V>, Cloneable {

  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  keys(): Set<K>;

  values(): Set<V>;

  forEach(iteration: Enumerator<K, V>): void;

  copy(): Project<K, V>;
}
