import { Nominative } from '../Nominative';
import { Try } from '../Try/Try';
import { AsyncConsumer, Consumer, MonoFunction, Predicate } from '../Type/Function';
import { None } from './None';
import { OptionalError } from './OptionalError';
import { Some } from './Some';

export abstract class Optional<T extends Nominative> implements Nominative {
  public abstract readonly noun: string;

  protected constructor() {
  }

  public abstract get(): T;

  public abstract isPresent(): this is Some<T>;

  public abstract isEmpty(): this is None<T>;

  public abstract ifPresent(consumer: Consumer<T>): void;

  public abstract ifPresentAsync(consumer: AsyncConsumer<T>): Promise<void>;

  public abstract filter(predicate: Predicate<T>): Optional<T>;

  public abstract map<U extends Nominative>(mapper: MonoFunction<T, U>): Optional<U>;

  public abstract equals(other: Optional<T>): boolean;

  public abstract toTry(): Try<T, OptionalError>;
}
