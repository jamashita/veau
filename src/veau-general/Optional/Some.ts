import { empty } from './Empty';
import { maybe } from './Maybe';
import { Optional } from './Optional';

export class Some<T> implements Optional<T> {
  private value: T;

  public static of<T>(value: T): Some<T> {
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

  public ifPresent(consumer: (value: T) => void): void {
    consumer(this.value);
  }

  public map<U>(func: (value: T) => U): Optional<U> {
    const result: U = func(this.value);

    return maybe<U>(result);
  }

  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (predicate(this.value)) {
      return this;
    }

    return empty<T>();
  }

  public toString(): string {
    return `Optional<${String(this.value)}>`;
  }
}
