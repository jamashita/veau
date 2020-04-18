import { HeaderSizeError } from '../Error/HeaderSizeError';
import { ValueObject } from '../General/Object/ValueObject';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';

export class HeaderSize extends ValueObject {
  public readonly noun: 'HeaderSize' = 'HeaderSize';
  private readonly size: number;

  public static of(size: number): Superposition<HeaderSize, HeaderSizeError> {
    if (size < 0) {
      return Failure.of<HeaderSize, HeaderSizeError>(new HeaderSizeError(`ILLEGAL SIZE SPECIFIED ${size}`));
    }
    if (Type.isInteger(size)) {
      return Success.of<HeaderSize, HeaderSizeError>(new HeaderSize(size));
    }

    return Failure.of<HeaderSize, HeaderSizeError>(new HeaderSizeError('ILLEGAL SIZE SPECIFIED'));
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
