import { JSON } from './Type/JSON';

export interface JSONable {

  toJSON(): JSON;
}
