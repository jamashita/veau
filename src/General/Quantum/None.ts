import { Failure } from '../Superposition/Failure';
import { Superposition } from '../Superposition/Superposition';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { Quantum } from './Quantum';
import { QuantumError } from './QuantumError';

export class None<T> extends Quantum<T> {
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
    throw new QuantumError('IS NOT PRESENT');
  }

  public isAbsent(): this is None<T> {
    return true;
  }

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresent(consumer: Consumer<T> | AsyncConsumer<T>): void | Promise<void> {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): None<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(mapper: MonoFunction<T, Suspicious<U>>): Quantum<U> {
    return this.transform<U>();
  }

  private transform<U>(): None<U> {
    return this as never as None<U>;
  }

  public toSuperposition(): Superposition<T, QuantumError> {
    return Failure.of<T, QuantumError>(new QuantumError('IS NOT PRESENT'));
  }
}
