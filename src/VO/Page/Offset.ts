import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { OffsetError } from './Error/OffsetError';

export class Offset extends ValueObject<Offset, 'Offset'> {
  public readonly noun: 'Offset' = 'Offset';
  private readonly offset: number;

  public static of(offset: number): Superposition<Offset, OffsetError> {
    if (offset < 0) {
      return Superposition.dead<Offset, OffsetError>(
        new OffsetError(`ILLEGAL OFFSET SPECIFIED ${offset}`),
        OffsetError
      );
    }
    if (Kind.isInteger(offset)) {
      return Superposition.alive<Offset, OffsetError>(new Offset(offset), OffsetError);
    }

    return Superposition.dead<Offset, OffsetError>(new OffsetError('ILLEGAL OFFSET SPECIFIED'), OffsetError);
  }

  protected constructor(offset: number) {
    super();
    this.offset = offset;
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

  public get(): number {
    return this.offset;
  }
}
