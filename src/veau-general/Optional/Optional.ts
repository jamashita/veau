import { Nominative } from '../Nominative';
import { Try } from '../Try/Try';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { None } from './None';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export interface Optional<T extends Nominative> extends Nominative {

  get(): T;

  isPresent(): this is Some<T>;

  isEmpty(): this is None<T>;

  ifPresent(consumer: Function<T, void>): void;

  ifPresentAsync(consumer: Function<T, Promise<void>>): Promise<void>;

  filter(predicate: Predicate<T>): Optional<T>;

  map<U extends Nominative>(mapper: Function<T, U>): Optional<U>;

  equals(other: Optional<T>): boolean;

  toTry(): Try<T, OptionalError>;
}
