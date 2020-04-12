import { HeaderSizeError } from '../Error/HeaderSizeError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { Type } from '../General/Type/Type';
import { ValueObject } from '../General/ValueObject';

export class HeaderSize extends ValueObject {
  public readonly noun: 'HeaderSize' = 'HeaderSize';
  private readonly size: number;

  public static of(size: number): Try<HeaderSize, HeaderSizeError> {
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

  public toString(): string {
    return `${this.size}`;
  }
}