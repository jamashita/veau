import { empty } from './Empty';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';

export class None<T> implements Optional<T> {

  public static of<T>(): None<T> {
    return new None<T>();
  }

  private constructor() {
  }

  public get(): T {
    throw new OptionalError('IS NOT PRESENT');
  }

  public isPresent(): boolean {
    return false;
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresent(consumer: (value: T) => void): void {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(func: (value: T) => U): Optional<U> {
    return empty<U>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: (value: T) => boolean): Optional<T> {
    return this;
  }

  public toString(): string {
    return 'Optional<NULL>';
  }
}
