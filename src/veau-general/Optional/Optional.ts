import { Nominative } from '../Nominative';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';

export interface Optional<T extends Nominative> extends Nominative {

  get(): T;

  isPresent(): boolean;

  ifPresentOrElse<U>(present: Function<T, U>, empty: Function<void, U>): U;

  filter(predicate: Predicate<T>): Optional<T>;

  map<U extends Nominative>(mapper: Function<T, U>): Optional<U>;

  equals(other: Optional<T>): boolean;
}
