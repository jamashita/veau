import { ValueObject } from '../veau-general/ValueObject';
import { Column } from './Column';
import { Row } from './Row';

export class Coordinate extends ValueObject {
  public readonly noun: 'Coordinate' = 'Coordinate';
  private readonly row: Row;
  private readonly column: Column;

  public static of(row: Row, column: Column): Coordinate {
    return new Coordinate(row, column);
  }

  private constructor(row: Row, column: Column) {
    super();
    this.row = row;
    this.column = column;
  }

  public getRow(): Row {
    return this.row;
  }

  public getColumn(): Column {
    return this.column;
  }

  public equals(other: Coordinate): boolean {
    if (this === other) {
      return true;
    }

    const {
      row,
      column
    } = this;

    if (!row.equals(other.row)) {
      return false;
    }
    if (!column.equals(other.column)) {
      return false;
    }

    return true;
  }

  public toString(): string {
    const {
      row,
      column
    } = this;

    return `${row.toString()} ${column.toString()}`;
  }
}
