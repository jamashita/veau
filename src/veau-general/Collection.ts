import { Equalable } from './Equalable';
import { Serializable } from './Serializable';
import { Enumerator } from './Type/Enumerator';

export interface Collection<K, V> extends Serializable, Equalable {

  get(key: K): V;

  contains(value: V): boolean;

  size(): number;

  forEach(enumerator: Enumerator<K, V>): void;

  isEmpty(): boolean;
}
