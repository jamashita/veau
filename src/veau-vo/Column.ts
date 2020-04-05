import { ColumnError } from '../veau-error/ColumnError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Column extends ValueObject {
  public readonly noun: 'Column' = 'Column';
  private column: number;

  public static of(column: number): Try<Column, ColumnError> {
    if (column < 0) {
      return Failure.of<Column, ColumnError>(new ColumnError(`ILLEGAL COLUMN SPECIFIED ${column.toString()}`));
    }
    if (Type.isInteger(column)) {
      return Success.of<Column, ColumnError>(new Column(column));
    }

    return Failure.of<Column, ColumnError>(new ColumnError('ILLEGAL COLUMN SPECIFIED'));
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
