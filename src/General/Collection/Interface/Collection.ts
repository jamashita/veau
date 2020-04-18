import { Equalable } from '../../Interface/Equalable';
import { Nominative } from '../../Interface/Nominative';
import { Noun } from '../../Interface/Noun';
import { Serializable } from '../../Interface/Serializable';
import { Quantum } from '../../Quantum/Quantum';

export interface Collection<K, V extends Nominative> extends Equalable, Serializable, Noun {

  get(key: K): Quantum<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
