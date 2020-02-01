import { Nominative } from '../Nominative';
import { None } from './None';
import { Optional } from './Optional';
import { Some } from './Some';

type Suspicious = undefined | null | Nominative;

export const maybe: <T extends Nominative>(value: Suspicious) => Optional<T> = <T extends Nominative>(value: Suspicious): Optional<T> => {
  if (value === null) {
    return None.of<T>();
  }
  if (value === undefined) {
    return None.of<T>();
  }

  return Some.of<T>(value as T);
};
