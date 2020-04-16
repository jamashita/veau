import { Noun } from '../Interface/Noun';
import { Try } from '../Superposition/Try';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { None } from './None';
import { QuantumError } from './QuantumError';
import { Some } from './Some';

export abstract class Quantum<T> implements Noun {
  public abstract readonly noun: 'Some' | 'None';

  protected constructor() {
  }

  public abstract get(): T;

  public isPresent(): this is Some<T> {
    return false;
  }

  public isAbsent(): this is None<T> {
    return false;
  }

  public abstract ifPresent(consumer: Consumer<T>): void;
  public abstract ifPresent(consumer: AsyncConsumer<T>): Promise<void>;

  public abstract filter(predicate: Predicate<T>): Quantum<T>;

  public abstract map<U>(mapper: MonoFunction<T, Suspicious<U>>): Quantum<U>;

  public abstract toTry(): Try<T, QuantumError>;
}
