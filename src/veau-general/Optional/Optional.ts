import { Equalable } from '../Equalable';
import { Serializable } from '../Serializable';
import { Consumer } from '../Type/Consumer';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';

export interface Optional<T extends Equalable & Serializable> extends Equalable, Serializable {

  get(): T;

  isPresent(): boolean;

  ifPresent(consumer: Consumer<T>): void;

  map<U extends Equalable>(func: Function<T, U>): Optional<U>;

  filter(predicate: Predicate<T>): Optional<T>;
}
