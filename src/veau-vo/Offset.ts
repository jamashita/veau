import { RuntimeError } from '../veau-error/RuntimeError';
import { ValueObject } from './ValueObject';

export class Offset extends ValueObject {
  private offset: number;

  public static of(offset: number): Offset {
    if (offset <= 0) {
      throw new RuntimeError(`ILLEGAL OFFSET SPECIFIED ${offset}`);
    }

    return new Offset(offset);
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
