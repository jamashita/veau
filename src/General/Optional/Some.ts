import { Success } from '../Try/Success';
import { Try } from '../Try/Try';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { maybe } from './Maybe';
import { None } from './None';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';

export class Some<T> extends Optional<T> {
  public readonly noun: 'Some' = 'Some';
  private readonly value: T;

  public static of<T>(value: T): Some<T> {
    return new Some<T>(value);
  }

  private constructor(value: T) {
    super();
    this.value = value;
  }

  public get(): T {
    return this.value;
  }

  public isPresent(): this is Some<T> {
    return true;
  }

  public isAbsent(): this is None<T> {
    return false;
  }

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  public ifPresent(consumer: Consumer<T> | AsyncConsumer<T>): void | Promise<void> {
    return consumer(this.value);
  }

  public filter(predicate: Predicate<T>): Optional<T> {
    if (predicate(this.value)) {
      return this;
    }

    return None.of<T>();
  }

  public map<U>(mapper: MonoFunction<T, Suspicious<U>>): Optional<U> {
    const result: Suspicious<U> = mapper(this.value);

    return maybe<U>(result);
  }

  public toTry(): Try<T, OptionalError> {
    return Success.of<T, OptionalError>(this.value);
  }
}