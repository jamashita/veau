import { Noun } from '../Interface/Noun';
import { Superposition } from '../Superposition/Superposition';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { Suspicious } from '../Type/Value';
import { Absent } from './Absent';
import { Present } from './Present';
import { QuantumError } from './QuantumError';

export abstract class Quantum<T> implements Noun {
  public abstract readonly noun: 'Present' | 'Absent';

  protected constructor() {
  }

  public abstract get(): T;

  public isPresent(): this is Present<T> {
    return false;
  }

  public isAbsent(): this is Absent<T> {
    return false;
  }

  public abstract ifPresent(consumer: Consumer<T>): void;
  public abstract ifPresent(consumer: AsyncConsumer<T>): Promise<void>;

  public abstract filter(predicate: Predicate<T>): Quantum<T>;

  public abstract map<U>(mapper: MonoFunction<T, Suspicious<U>>): Quantum<U>;

  public abstract toSuperposition(): Superposition<T, QuantumError>;
}
