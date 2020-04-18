import { Equalable } from './Equalable';
import { Noun } from './Noun';
import { Serializable } from './Serializable';

export interface Nominative extends Equalable, Serializable, Noun {

  hashCode(): string;
}
