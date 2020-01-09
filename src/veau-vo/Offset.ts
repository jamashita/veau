import { RuntimeError } from '../veau-general/RuntimeError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Offset extends ValueObject {
  private offset: number;

  public static of(offset: number): Offset {
    if (offset < 0) {
      throw new RuntimeError(`ILLEGAL OFFSET SPECIFIED ${offset.toString()}`);
    }
    if (Type.isInteger(offset)) {
      return new Offset(offset);
    }

    throw new RuntimeError('ILLEGAL OFFSET SPECIFIED');
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
    if (this.offset === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.offset.toString();
  }
}
