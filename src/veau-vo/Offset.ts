import { OffsetError } from '../veau-error/OffsetError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Offset extends ValueObject {
  public readonly noun: 'Offset' = 'Offset';
  private readonly offset: number;

  public static of(offset: number): Try<Offset, OffsetError> {
    if (offset < 0) {
      return Failure.of<Offset, OffsetError>(new OffsetError(`ILLEGAL OFFSET SPECIFIED ${offset}`));
    }
    if (Type.isInteger(offset)) {
      return Success.of<Offset, OffsetError>(new Offset(offset));
    }

    return Failure.of<Offset, OffsetError>(new OffsetError('ILLEGAL OFFSET SPECIFIED'));
  }

  private constructor(offset: number) {
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

  public toString(): string {
    return `${this.offset}`;
  }
}
