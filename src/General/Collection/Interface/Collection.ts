import { Nominative } from '../../Interface/Nominative';
import { Quantum } from '../../Quantum/Quantum';

export interface Collection<K, V extends Nominative> extends Nominative {

  get(key: K): Quantum<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
