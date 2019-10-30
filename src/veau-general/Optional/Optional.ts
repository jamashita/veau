export interface Optional<T> {

  get(): T;

  isPresent(): boolean;

  ifPresent(consumer: (value: T) => void): void;

  map<U>(func: (value: T) => U): Optional<U>;

  filter(predicate: (value: T) => boolean): Optional<T>;

  toString(): string;
}
