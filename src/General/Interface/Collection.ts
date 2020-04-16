import { Optional } from '../Quantum/Optional';
import { Nominative } from './Nominative';

export interface Collection<K, V extends Nominative> extends Nominative {

  get(key: K): Optional<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
