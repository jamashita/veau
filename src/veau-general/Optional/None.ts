import { Nominative } from '../Nominative';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export class None<T extends Nominative> implements Optional<T> {

  public static of<T extends Nominative>(): None<T> {
    return new None<T>();
  }

  private constructor() {
  }

  public get(): T {
    throw new OptionalError('IS NOT PRESENT');
  }

  public isPresent(): this is Some<T> {
    return false;
  }

  public isEmpty(): this is None<T> {
    return true;
  }

  public ifPresentOrElse<U>(present: Function<T, unknown>, empty: Function<void, U>): U {
    return empty();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): Optional<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U extends Nominative>(mapper: Function<T, U>): Optional<U> {
    return None.of<U>();
  }

  public equals(other: Optional<T>): boolean {
    if (this === other) {
      return true;
    }

    if (other instanceof None) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return 'Optional<NONE>';
  }
}
