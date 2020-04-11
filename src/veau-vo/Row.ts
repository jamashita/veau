import { RowError } from '../veau-error/RowError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Row extends ValueObject {
  public readonly noun: 'Row' = 'Row';
  private readonly row: number;

  public static of(row: number): Try<Row, RowError> {
    if (row < 0) {
      return Failure.of<Row, RowError>(new RowError(`ILLEGAL ROW SPECIFIED ${row}`));
    }
    if (Type.isInteger(row)) {
      return Success.of<Row, RowError>(new Row(row));
    }

    return Failure.of<Row, RowError>(new RowError('ILLEGAL ROW SPECIFIED'));
  }

  public static default(): Row {
    return new Row(0);
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
    if (this.row === other.row) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return `${this.row}`;
  }
}
