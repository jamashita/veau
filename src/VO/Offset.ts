import { OffsetError } from '../Error/OffsetError';
import { ValueObject } from '../General/Object/ValueObject';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';

export class Offset extends ValueObject {
  public readonly noun: 'Offset' = 'Offset';
  private readonly offset: number;

  public static of(offset: number): Superposition<Offset, OffsetError> {
    if (offset < 0) {
      return Failure.of<Offset, OffsetError>(new OffsetError(`ILLEGAL OFFSET SPECIFIED ${offset}`));
    }
    if (Type.isInteger(offset)) {
      return Success.of<Offset, OffsetError>(new Offset(offset));
    }

    return Failure.of<Offset, OffsetError>(new OffsetError('ILLEGAL OFFSET SPECIFIED'));
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

  protected serialize(): string {
    return `${this.offset}`;
  }
}
