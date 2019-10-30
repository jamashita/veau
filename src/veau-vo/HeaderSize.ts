import { RuntimeError } from '../veau-general/RuntimeError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from './ValueObject';

export class HeaderSize extends ValueObject {
  private size: number;

  public static of(size: number): HeaderSize {
    if (size < 0) {
      throw new RuntimeError(`ILLEGAL SIZE SPECIFIED ${size}`);
    }
    if (Type.isInteger(size)) {
      return new HeaderSize(size);
    }

    throw new RuntimeError(`ILLEGAL SIZE SPECIFIED ${size}`);
  }
  private constructor(size: number) {
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
    if (this.size === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.size.toString();
  }
}
