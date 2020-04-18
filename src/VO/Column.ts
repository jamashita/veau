import { ColumnError } from '../Error/ColumnError';
import { ValueObject } from '../General/Object/ValueObject';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';

const ORIGIN_VALUE: number = 0;

export class Column extends ValueObject {
  public readonly noun: 'Column' = 'Column';
  private readonly column: number;

  private static readonly ORIGIN: Column = new Column(ORIGIN_VALUE);

  public static of(column: number): Superposition<Column, ColumnError> {
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

  public serialize(): string {
    return `${this.column}`;
  }
}
