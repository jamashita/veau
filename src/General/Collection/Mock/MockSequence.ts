import { Nominative } from '../../Interface/Nominative';
import { ISequence } from '../Interface/ISequence';
import { UnimplementedError } from '../../UnimplementedError';
import { Enumerator, Mapper, Predicate } from '../../Type/Function';
import { Optional } from '../../Optional/Optional';

export class MockSequence<E extends Nominative> implements ISequence<E>{
  public readonly noun: 'Sequence' = 'Sequence';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(...elements: Array<E>): ISequence<E> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public contains(value: E): boolean {
    throw new UnimplementedError();
  }

  public copy(): ISequence<E> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: ISequence<E>): boolean {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public every(enumerator: Enumerator<number, E>): boolean {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get(key: number): Optional<E> {
    throw new UnimplementedError();
  }

  public isEmpty(): boolean {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public iterate(iteration: Mapper<E, void>): void {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public project<F extends Nominative>(mapper: Mapper<E, F>): ISequence<F> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public screen(iterator: Enumerator<number, E>): ISequence<E> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public select(predicate: Predicate<E>): Optional<E> {
    throw new UnimplementedError();
  }

  public size(): number {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public some(enumerator: Enumerator<number, E>): boolean {
    throw new UnimplementedError();
  }

  public toArray(): Array<E> {
    throw new UnimplementedError();
  }
}
