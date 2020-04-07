export type Primitive = null | undefined | number | string | boolean;

type Value = Primitive | PlainObject;
export type PlainObject = {
  [name: string]: Value | Array<Value>;
};
type Item = Primitive | PlainObject;
export type JSObjectNotation = Item | Array<Item>;
