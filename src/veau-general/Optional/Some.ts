import { Nominative } from '../Nominative';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { maybe } from './Maybe';
import { None } from './None';
import { Optional } from './Optional';

export class Some<T extends Nominative> implements Optional<T> {
  private value: T;

  public static of<T extends Nominative>(value: T): Some<T> {
    return new Some<T>(value);
  }

  private constructor(value: T) {
    this.value = value;
  }

  public get(): T {
    return this.value;
  }

  public isPresent(): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresentOrElse<U>(present: Function<T, U>, empty: Function<void, unknown>): U {
    return present(this.value);
  }

  public filter(predicate: Predicate<T>): Optional<T> {
    if (predicate(this.value)) {
      return this;
    }

    return None.of<T>();
  }

  public map<U extends Nominative>(mapper: Function<T, U>): Optional<U> {
    const result: U = mapper(this.value);

    return maybe<U>(result);
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
