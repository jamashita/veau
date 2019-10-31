import { Consumer } from '../Type/Consumer';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
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
  public ifPresent(consumer: Consumer<T>): void {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(func: Function<T, U>): Optional<U> {
    return empty<U>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): Optional<T> {
    return this;
  }

  public toString(): string {
    return 'Optional<NULL>';
  }
}
