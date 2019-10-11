import { Serializable } from './Serializable';
import { Enumerator } from './Type/Enumerator';

export interface Collection<K, V> extends Serializable {

  get(key: K): V;

  add(value: V): this;

  contains(value: V): boolean;

  forEach(enumerator: Enumerator<V>): void;

  isEmpty(): boolean;

  equals(other: Collection<K, V>): boolean;

  toString(): string;
}
