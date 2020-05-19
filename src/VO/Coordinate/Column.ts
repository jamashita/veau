import { Alive, Dead, Kind, Superposition, ValueObject } from 'publikum';
import { ColumnError } from './Error/ColumnError';

const ORIGIN_VALUE: number = 0;

export class Column extends ValueObject {
  public readonly noun: 'Column' = 'Column';
  private readonly column: number;

  private static readonly ORIGIN: Column = new Column(ORIGIN_VALUE);

  public static of(column: number): Superposition<Column, ColumnError> {
    if (column < 0) {
      return Dead.of<Column, ColumnError>(new ColumnError(`ILLEGAL COLUMN SPECIFIED ${column}`));
    }
    if (column === ORIGIN_VALUE) {
      return Alive.of<Column, ColumnError>(Column.origin());
    }
    if (Kind.isInteger(column)) {
      return Alive.of<Column, ColumnError>(new Column(column));
    }

    return Dead.of<Column, ColumnError>(new ColumnError('ILLEGAL COLUMN SPECIFIED'));
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
