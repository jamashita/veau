import { Suspicious } from '../Type/Value';
import { None } from './None';
import { Optional } from './Optional';
import { Some } from './Some';

export const maybe = <T>(value: Suspicious<T>): Optional<T> => {
  if (value === null) {
    return None.of<T>();
  }
  if (value === undefined) {
    return None.of<T>();
  }
  if (value instanceof Optional) {
    return value;
  }

  return Some.of<T>(value);
};
