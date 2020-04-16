import { Suspicious } from '../Type/Value';
import { None } from './None';
import { Quantum } from './Quantum';
import { Some } from './Some';

export const maybe = <T>(value: Suspicious<T>): Quantum<T> => {
  if (value === null) {
    return None.of<T>();
  }
  if (value === undefined) {
    return None.of<T>();
  }
  if (value instanceof Quantum) {
    return value;
  }

  return Some.of<T>(value);
};
