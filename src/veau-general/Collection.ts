import { Serializable } from './Serializable';
import { Enumerator } from './Type/Enumerator';

export interface Collection<K, V> extends Serializable {

  get(key: K): V;

  contains(value: V): boolean;

  size(): number;

  forEach(enumerator: Enumerator<V>): void;

  isEmpty(): boolean;

  equals(other: Collection<K, V>): boolean;
}
