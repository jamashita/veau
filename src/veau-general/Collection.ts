import { Nominative } from './Nominative';
import { Optional } from './Optional/Optional';

export interface Collection<K, V extends Nominative> extends Nominative, Iterable<V> {

  get(key: K): Optional<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
