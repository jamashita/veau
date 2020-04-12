import { Failure } from '../Try/Failure';
import { Try } from '../Try/Try';
import { AsyncConsumer, Consumer } from '../Type/Function';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

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

  public isPresent(): this is Some<T> {
    return false;
  }

  public isAbsent(): this is None<T> {
    return true;
  }

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): Promise<void>;
  public ifPresent(): void | Promise<void> {
    // NOOP
  }

  public filter(): None<T> {
    return this;
  }

  public map<U>(): None<U> {
    return this.transform<U>();
  }

  private transform<U>(): None<U> {
    return this as never as None<U>;
  }

  public toTry(): Try<T, OptionalError> {
    return Failure.of<T, OptionalError>(new OptionalError('IS NOT PRESENT'));
  }
}
