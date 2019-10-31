import { RuntimeError } from '../veau-general/RuntimeError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Column extends ValueObject {
  private column: number;

  public static of(column: number): Column {
    if (column < 0) {
      throw new RuntimeError(`ILLEGAL COLUMN SPECIFIED ${column}`);
    }
    if (Type.isInteger(column)) {
      return new Column(column);
    }

    throw new RuntimeError(`ILLEGAL COLUMN SPECIFIED ${column}`);
  }
  private constructor(column: number) {
    super();
    this.column = column;
  }

  public get(): number {
    return this.column;
  }

  public equals(other: Column): boolean {
    if (this === other) {
      return true;
    }
    if (this.column === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.column.toString();
  }
}
