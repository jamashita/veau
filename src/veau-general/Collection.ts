import { Equalable } from './Equalable';
import { Projectable } from './Projectable';
import { Serializable } from './Serializable';
import { Enumerator } from './Type/Enumerator';
import { Mapper } from './Type/Mapper';

export interface Collection<K, V> extends Serializable, Equalable, Projectable<V> {

  get(key: K): V;

  contains(value: V): boolean;

  size(): number;

  forEach(enumerator: Enumerator<K, V>): void;

  isEmpty(): boolean;

  map<U>(mapper: Mapper<V, U>): Array<U>;
}
