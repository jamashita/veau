import { Equalable } from '../Equalable';
import { Serializable } from '../Serializable';
import { Consumer } from '../Type/Consumer';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';

export class None<T extends Equalable & Serializable> implements Optional<T> {

  public static of<T extends Equalable & Serializable>(): None<T> {
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
  public map<U extends Equalable & Serializable>(func: Function<T, U>): Optional<U> {
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
