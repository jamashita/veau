import { Noun } from '../Noun';
import { Try } from '../Try/Try';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { None } from './None';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export abstract class Optional<T> implements Noun {
  public abstract readonly noun: 'Some' | 'None';

  protected constructor() {
  }

  public abstract get(): T;

  public abstract isPresent(): this is Some<T>;

  public abstract isAbsent(): this is None<T>;

  public abstract ifPresent(consumer: Consumer<T>): void;

  public abstract ifPresentAsync(consumer: AsyncConsumer<T>): Promise<void>;

  public abstract filter(predicate: Predicate<T>): Optional<T>;

  public abstract map<U>(mapper: MonoFunction<T, Suspicious<U>>): Optional<U>;

  public abstract toTry(): Try<T, OptionalError>;
}
