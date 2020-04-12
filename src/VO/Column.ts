import { ColumnError } from '../Error/ColumnError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { Type } from '../General/Type/Type';
import { ValueObject } from '../General/ValueObject';

export class Column extends ValueObject {
  public readonly noun: 'Column' = 'Column';
  private readonly column: number;

  public static of(column: number): Try<Column, ColumnError> {
    if (column < 0) {
      return Failure.of<Column, ColumnError>(new ColumnError(`ILLEGAL COLUMN SPECIFIED ${column}`));
    }
    if (Type.isInteger(column)) {
      return Success.of<Column, ColumnError>(new Column(column));
    }

    return Failure.of<Column, ColumnError>(new ColumnError('ILLEGAL COLUMN SPECIFIED'));
  }

  protected constructor(column: number) {
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
    if (this.column === other.column) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return `${this.column}`;
  }
}
