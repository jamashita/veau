import { ColumnError } from '../Error/ColumnError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { Type } from '../General/Type/Type';
import { ValueObject } from '../General/ValueObject';

const ORIGIN_VALUE: number = 0;

export class Column extends ValueObject {
  public readonly noun: 'Column' = 'Column';
  private readonly column: number;

  private static readonly ORIGIN: Column = new Column(ORIGIN_VALUE);

  public static of(column: number): Try<Column, ColumnError> {
    if (column < 0) {
      return Failure.of<Column, ColumnError>(new ColumnError(`ILLEGAL COLUMN SPECIFIED ${column}`));
    }
    if (column === ORIGIN_VALUE) {
      return Success.of<Column, ColumnError>(Column.origin());
    }
    if (Type.isInteger(column)) {
      return Success.of<Column, ColumnError>(new Column(column));
    }

    return Failure.of<Column, ColumnError>(new ColumnError('ILLEGAL COLUMN SPECIFIED'));
  }

  public static origin(): Column {
    return Column.ORIGIN;
  }

  protected constructor(column: number) {
    super();
    this.column = column;
  }

  public get(): number {
    return this.column;
  }

  public isOrigin(): boolean {
    if (this === Column.origin()) {
      return true;
    }

    return false;
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
