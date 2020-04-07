import { JSObjectNotation } from './Type/Value';

export interface JSONable {

  toJSON(): JSObjectNotation;
}
