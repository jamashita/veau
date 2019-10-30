import { Equalable } from './Equalable';

export interface Identifier extends Equalable {

  equals(other: Identifier): boolean;
}
