export type Primitive = null | undefined | number | string | boolean;
export type Nullable<T> = T | null;
export type Ambiguous<T>  = T | undefined;
export type Suspicious<T> = T | null | undefined;
type Value = Primitive | PlainObject;
export type PlainObject = {
  [name: string]: Value | Array<Value>;
};
type Item = Primitive | PlainObject;
export type JSObjectNotation = Item | Array<Item>;
