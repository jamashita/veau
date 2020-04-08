import { Nominative } from '../Nominative';
import { Suspicious } from '../Type/Value';
import { None } from './None';
import { Optional } from './Optional';
import { Some } from './Some';

export const maybe: <T extends Nominative>(value: Suspicious<T>) => Optional<T> = <T extends Nominative>(value: Suspicious<T>) => {
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
