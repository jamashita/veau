import { Nominative } from '../Nominative';
import { Try } from '../Try/Try';
import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
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

  public abstract ifPresent(consumer: Function<T, void>): void;

  public abstract ifPresentAsync(consumer: Function<T, Promise<void>>): Promise<void>;

  public abstract filter(predicate: Predicate<T>): Optional<T>;

  public abstract map<U extends Nominative>(mapper: Function<T, U>): Optional<U>;

  public abstract equals(other: Optional<T>): boolean;

  public abstract toTry(): Try<T, OptionalError>;
}
