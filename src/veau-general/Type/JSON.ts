import { PlainObject } from './PlainObject';
import { Primitive } from './Primitive';

export type JSON = PlainObject | Array<Primitive | PlainObject>;
