export type Primitive = null | undefined | number | string | boolean;
export type Nullable<T> = T | null;
export type Ambiguous<T>  = T | undefined;
export type Suspicious<T> = T | null | undefined;
export type PlainObject = {
  [name: string]: Item | Array<Item>;
};
type Item = Primitive | PlainObject;
export type JSObjectNotation = PlainObject | Array<Item>;
