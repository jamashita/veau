import { Cloneable } from '../../../Interface/Cloneable';
import { Nominative } from '../../../Interface/Nominative';
import { Enumerator } from '../../../Type/Function';
import { Collection } from '../../Interface/Collection';

export interface Project<K extends Nominative, V extends Nominative> extends Collection<K, V>, Cloneable<Project<K, V>> {

  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  has(key: K): boolean;

  forEach(iteration: Enumerator<K, V>): void;
}
