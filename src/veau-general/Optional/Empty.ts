import { None } from './None';
import { Optional } from './Optional';

export const empty: <T>() => Optional<T> = <T>(): Optional<T> => {
  return None.of<T>();
};
