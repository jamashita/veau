import { Failure } from '../Try/Failure';
import { Try } from '../Try/Try';
import { MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';

export class None<T> extends Optional<T> {
  public readonly noun: 'None' = 'None';

  private static readonly INSTANCE: None<void> = new None();

  public static of(): None<void>;
  public static of<T>(): None<T>;
  public static of<T>(): None<T> {
    return None.INSTANCE.transform<T>();
  }

  private constructor() {
    super();
  }

  public get(): never {
    throw new OptionalError('IS NOT PRESENT');
  }

  public isAbsent(): this is None<T> {
    return true;
  }

  public ifPresent(consumer: MonoFunction<T, void>): void;
  public ifPresent(consumer: MonoFunction<T, Promise<void>>): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresent(consumer: MonoFunction<T, void> | MonoFunction<T, Promise<void>>): void | Promise<void> {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): None<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(mapper: MonoFunction<T, Suspicious<U>>): Optional<U> {
    return this.transform<U>();
  }

  private transform<U>(): None<U> {
    return this as never as None<U>;
  }

  public toTry(): Try<T, OptionalError> {
    return Failure.of<T, OptionalError>(new OptionalError('IS NOT PRESENT'));
  }
}
