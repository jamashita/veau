import { Nominative } from '../Nominative';
import { Consumer } from '../Type/Consumer';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';

export class None<T extends Nominative> implements Optional<T> {

  public static of<T extends Nominative>(): None<T> {
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
  public ifPresent(action: Consumer<T>): void {
    // NOOP
  }

  public ifPresentOrElse(action: Consumer<T>, emptyAction: Consumer<void>): void {
    emptyAction();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U extends Nominative>(func: Function<T, U>): Optional<U> {
    return None.of<U>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): Optional<T> {
    return this;
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
