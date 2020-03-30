import { Equalable } from './Equalable';
import { Serializable } from './Serializable';

export interface Collection<K, V> extends Serializable, Equalable {

  get(key: K): V;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
