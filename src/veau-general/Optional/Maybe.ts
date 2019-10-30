import { None } from './None';
import { Optional } from './Optional';
import { Some } from './Some';

export const maybe: <T>(value: any) => Optional<T> = <T>(value: any): Optional<T> => {
  if (value === null) {
    return None.of<T>();
  }
  if (value === undefined) {
    return None.of<T>();
  }

  return Some.of<T>(value);
};
