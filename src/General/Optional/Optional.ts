import { Noun } from '../Interface/Noun';
import { Try } from '../Try/Try';
import { MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { None } from './None';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export abstract class Optional<T> implements Noun {
  public abstract readonly noun: 'Some' | 'None';

  protected constructor() {
  }

  public abstract get(): T;

  public isPresent(): this is Some<T> {
    return false;
  }

  public isAbsent(): this is None<T> {
    return false;
  }

  public abstract ifPresent(consumer: MonoFunction<T, void>): void;
  public abstract ifPresent(consumer: MonoFunction<T, Promise<void>>): Promise<void>;

  public abstract filter(predicate: Predicate<T>): Optional<T>;

  public abstract map<U>(mapper: MonoFunction<T, Suspicious<U>>): Optional<U>;

  public abstract toTry(): Try<T, OptionalError>;
}
