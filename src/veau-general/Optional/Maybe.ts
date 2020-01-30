import { Equalable } from '../Equalable';
import { Serializable } from '../Serializable';
import { None } from './None';
import { Optional } from './Optional';
import { Some } from './Some';

type Type = undefined | null | Equalable & Serializable;

export const maybe: <T extends Equalable & Serializable>(value: Type) => Optional<T> = <T extends Equalable & Serializable>(value: Type): Optional<T> => {
  if (value === null) {
    return None.of<T>();
  }
  if (value === undefined) {
    return None.of<T>();
  }

  return Some.of<T>(value as T);
};
