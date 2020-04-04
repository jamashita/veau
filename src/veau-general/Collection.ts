import { Equalable } from './Equalable';
import { Nominative } from './Nominative';
import { Optional } from './Optional/Optional';
import { Serializable } from './Serializable';

export interface Collection<K, V extends Nominative> extends Serializable, Equalable {

  get(key: K): Optional<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
