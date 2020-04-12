import { Failure } from '../Try/Failure';
import { Try } from '../Try/Try';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { Optional } from './Optional';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export class None<T> extends Optional<T> {
  public readonly noun: 'None' = 'None';

  private static readonly INSTANCE: None<void> = new None();

  public static of(): None<void>;
  public static of<T>(): None<T>;
  public static of<T = void>(): None<T> {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  public ifPresent(consumer: Consumer<T>): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresentAsync(consumer: AsyncConsumer<T>): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): None<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(mapper: MonoFunction<T, Suspicious<U>>): None<U> {
    return this.transform<U>();
  }

  private transform<U>(): None<U> {
    return this as never as None<U>;
  }

  public toTry(): Try<T, OptionalError> {
    return Failure.of<T, OptionalError>(new OptionalError('IS NOT PRESENT'));
  }
}
