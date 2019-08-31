import { Primitive } from './Primitive';

export type PlainObject = {
  [name: string]: Primitive | PlainObject | Array<Primitive> | Array<PlainObject>;
};
