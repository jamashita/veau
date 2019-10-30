import { Serializable } from '../Serializable';
import { Consumer } from '../Type/Consumer';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';

export interface Optional<T> extends Serializable {

  get(): T;

  isPresent(): boolean;

  ifPresent(consumer: Consumer<T>): void;

  map<U>(func: Function<T, U>): Optional<U>;

  filter(predicate: Predicate<T>): Optional<T>;
}
