import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { HeaderSizeError } from './Error/HeaderSizeError';

export class HeaderSize extends ValueObject<HeaderSize, 'HeaderSize'> {
  public readonly noun: 'HeaderSize' = 'HeaderSize';
  private readonly size: number;

  public static of(size: number): Superposition<HeaderSize, HeaderSizeError> {
    if (size < 0) {
      return Superposition.ofSchrodinger<HeaderSize, HeaderSizeError>(
        Dead.of<HeaderSize, HeaderSizeError>(new HeaderSizeError(`ILLEGAL SIZE SPECIFIED ${size}`))
      );
    }
    if (Kind.isInteger(size)) {
      return Superposition.ofSchrodinger<HeaderSize, HeaderSizeError>(
        Alive.of<HeaderSize, HeaderSizeError>(new HeaderSize(size))
      );
    }

    return Superposition.ofSchrodinger<HeaderSize, HeaderSizeError>(
      Dead.of<HeaderSize, HeaderSizeError>(new HeaderSizeError('ILLEGAL SIZE SPECIFIED'))
    );
  }

  protected constructor(size: number) {
    super();
    this.size = size;
  }

  public get(): number {
    return this.size;
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
}
