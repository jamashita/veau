import { Nominative } from '../../Interface/Nominative';
import { Objet } from '../../Object/Objet';
import { Quantum } from '../../Quantum/Quantum';

export interface Collection<K, V extends Objet> extends Nominative {

  get(key: K): Quantum<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
