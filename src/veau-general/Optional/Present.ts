import { Optional } from './Optional';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export const present: <T>(value: any) => Optional<T> = <T>(value: any): Optional<T> => {
  if (value === null) {
    throw new OptionalError('VALUE IS NULL');
  }
  if (value === undefined) {
    throw new OptionalError('VALUE IS UNDEFINED');
  }

  return Some.of<T>(value);
};