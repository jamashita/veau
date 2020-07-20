import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { HeaderSizeError } from './Error/HeaderSizeError';

export class HeaderSize extends ValueObject<HeaderSize, 'HeaderSize'> {
  public readonly noun: 'HeaderSize' = 'HeaderSize';
  private readonly size: number;

  public static of(size: number): Superposition<HeaderSize, HeaderSizeError> {
    if (size < 0) {
      return Superposition.dead<HeaderSize, HeaderSizeError>(
        new HeaderSizeError(`ILLEGAL SIZE SPECIFIED ${size}`),
        HeaderSizeError
      );
    }
    if (Kind.isInteger(size)) {
      return Superposition.alive<HeaderSize, HeaderSizeError>(new HeaderSize(size), HeaderSizeError);
    }

    return Superposition.dead<HeaderSize, HeaderSizeError>(
      new HeaderSizeError('ILLEGAL SIZE SPECIFIED'),
      HeaderSizeError
    );
  }

  protected constructor(size: number) {
    super();
    this.size = size;
  }

  public equals(other: HeaderSize): boolean {
    if (this === other) {
      return true;
    }
    if (this.size === other.size) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.size}`;
  }

  public get(): number {
    return this.size;
  }
}
