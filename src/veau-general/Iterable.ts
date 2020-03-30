import { Enumerator } from './Type/Enumerator';

export interface Iterable<K, V> {

  forEach(iteration: Enumerator<K, V>): void;
}
