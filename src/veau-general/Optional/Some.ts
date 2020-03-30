import { Nominative } from '../Nominative';
import { Consumer } from '../Type/Consumer';
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

  public ifPresent(action: Consumer<T>): void {
    action(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresentOrElse(action: Consumer<T>, emptyAction: Consumer<void>): void {
    action(this.value);
  }

  public map<U extends Nominative>(func: Function<T, U>): Optional<U> {
    const result: U = func(this.value);

    return maybe<U>(result);
  }

  public filter(predicate: Predicate<T>): Optional<T> {
    if (predicate(this.value)) {
      return this;
    }

    return None.of<T>();
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
