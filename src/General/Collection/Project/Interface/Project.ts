import { Cloneable } from '../../../Interface/Cloneable';
import { Objet } from '../../../Object/Objet';
import { Enumerator } from '../../../Type/Function';
import { Collection } from '../../Interface/Collection';

export interface Project<K extends Objet, V extends Objet> extends Collection<K, V>, Cloneable<Project<K, V>> {

  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  has(key: K): boolean;

  forEach(iteration: Enumerator<K, V>): void;
}
