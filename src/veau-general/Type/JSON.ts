import { PlainObject } from './PlainObject';
import { Primitive } from './Primitive';

export type JSON = Primitive | PlainObject | Array<Primitive | PlainObject>;
