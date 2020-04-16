import { Success } from '../Try/Success';
import { Try } from '../Try/Try';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { maybe } from './Maybe';
import { None } from './None';
import { Quantum } from './Quantum';
import { QuantumError } from './QuantumError';

export class Some<T> extends Quantum<T> {
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

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): Promise<void>;
  public ifPresent(consumer: Consumer<T> | AsyncConsumer<T>): void | Promise<void> {
    return consumer(this.value);
  }

  public filter(predicate: Predicate<T>): Quantum<T> {
    if (predicate(this.value)) {
      return this;
    }

    return None.of<T>();
  }

  public map<U>(mapper: MonoFunction<T, Suspicious<U>>): Quantum<U> {
    const result: Suspicious<U> = mapper(this.value);

    return maybe<U>(result);
  }

  public toTry(): Try<T, QuantumError> {
    return Success.of<T, QuantumError>(this.value);
  }
}
