import { Suspicious } from '../Type/Value';
import { Absent } from './Absent';
import { Present } from './Present';
import { Quantum } from './Quantum';

export const maybe = <T>(value: Suspicious<T>): Quantum<T> => {
  if (value === null) {
    return Absent.of<T>();
  }
  if (value === undefined) {
    return Absent.of<T>();
  }
  if (value instanceof Quantum) {
    return value;
  }

  return Present.of<T>(value);
};
