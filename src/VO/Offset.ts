import { Alive, Dead, Kind, Superposition, ValueObject } from 'publikum';
import { OffsetError } from '../Error/OffsetError';

export class Offset extends ValueObject {
  public readonly noun: 'Offset' = 'Offset';
  private readonly offset: number;

  public static of(offset: number): Superposition<Offset, OffsetError> {
    if (offset < 0) {
      return Dead.of<Offset, OffsetError>(new OffsetError(`ILLEGAL OFFSET SPECIFIED ${offset}`));
    }
    if (Kind.isInteger(offset)) {
      return Alive.of<Offset, OffsetError>(new Offset(offset));
    }

    return Dead.of<Offset, OffsetError>(new OffsetError('ILLEGAL OFFSET SPECIFIED'));
  }

  protected constructor(offset: number) {
    super();
    this.offset = offset;
  }

  public get(): number {
    return this.offset;
  }

  public equals(other: Offset): boolean {
    if (this === other) {
      return true;
    }
    if (this.offset === other.offset) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.offset}`;
  }
}
