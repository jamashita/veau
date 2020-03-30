import { Nominative } from '../Nominative';
import { Consumer } from '../Type/Consumer';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';

export interface Optional<T extends Nominative> extends Nominative {

  get(): T;

  isPresent(): boolean;

  ifPresent(consumer: Consumer<T>): void;

  ifPresentOrElse(action: Consumer<T>, emptyAction: Consumer<void>): void;

  map<U extends Nominative>(func: Function<T, U>): Optional<U>;

  filter(predicate: Predicate<T>): Optional<T>;

  equals(other: Optional<T>): boolean;
}
