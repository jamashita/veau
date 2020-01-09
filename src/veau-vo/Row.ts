import { RuntimeError } from '../veau-general/RuntimeError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Row extends ValueObject {
  private row: number;

  public static of(row: number): Row {
    if (row < 0) {
      throw new RuntimeError(`ILLEGAL ROW SPECIFIED ${row.toString()}`);
    }
    if (Type.isInteger(row)) {
      return new Row(row);
    }

    throw new RuntimeError('ILLEGAL ROW SPECIFIED');
  }

  public static default(): Row {
    return Row.of(0);
  }

  private constructor(row: number) {
    super();
    this.row = row;
  }

  public get(): number {
    return this.row;
  }

  public equals(other: Row): boolean {
    if (this === other) {
      return true;
    }
    if (this.row === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.row.toString();
  }
}
