import { Nominative } from '../Nominative';
import { Success } from '../Try/Success';
import { Try } from '../Try/Try';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { maybe } from './Maybe';
import { None } from './None';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';

export class Some<T extends Nominative> extends Optional<T> {
  public readonly noun: 'Some' = 'Some';
  private readonly value: T;

  public static of<T extends Nominative>(value: T): Some<T> {
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

  public isEmpty(): this is None<T> {
    return false;
  }

  public ifPresent(consumer: Consumer<T>): void {
    consumer(this.value);
  }

  public ifPresentAsync(consumer: AsyncConsumer<T>): Promise<void> {
    return consumer(this.value);
  }

  public filter(predicate: Predicate<T>): Optional<T> {
    if (predicate(this.value)) {
      return this;
    }

    return None.of<T>();
  }

  public map<U extends Nominative>(mapper: MonoFunction<T, U>): Optional<U> {
    const result: U = mapper(this.value);

    return maybe<U>(result);
  }

  public toTry(): Try<T, OptionalError> {
    return Success.of<T, OptionalError>(this.value);
  }

  public equals(other: Optional<T>): boolean {
    if (this === other) {
      return true;
    }

    if (other instanceof Some) {
      return this.get().equals(other.get());
    }

    return false;
  }

  public toString(): string {
    return `Optional<${this.value.toString()}>`;
  }
}
