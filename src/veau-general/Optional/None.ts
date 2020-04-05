import { Nominative } from '../Nominative';
import { Failure } from '../Try/Failure';
import { Try } from '../Try/Try';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export class None<T extends Nominative> extends Optional<T> {

  public static of<T extends Nominative>(): None<T> {
    return new None<T>();
  }

  private constructor() {
    super();
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  public ifPresent(consumer: Function<T, void>): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresentAsync(consumer: Function<T, Promise<void>>): Promise<void> {
    return Promise.resolve<void>(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): Optional<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U extends Nominative>(mapper: Function<T, U>): Optional<U> {
    return None.of<U>();
  }

  public toTry(): Try<T, OptionalError> {
    return Failure.of<T, OptionalError>(new OptionalError('IS NOT PRESENT'));
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
