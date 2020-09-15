import { ValueObject } from '@jamashita/publikum-object';
import { Column } from './Column';
import { Row } from './Row';

export class Coordinate extends ValueObject<Coordinate, 'Coordinate'> {
  public readonly noun: 'Coordinate' = 'Coordinate';
  private readonly row: Row;
  private readonly column: Column;

  public static of(row: Row, column: Column): Coordinate {
    return new Coordinate(row, column);
  }

  protected constructor(row: Row, column: Column) {
    super();
    this.row = row;
    this.column = column;
  }

  public equals(other: Coordinate): boolean {
    if (this === other) {
      return true;
    }
    if (!this.row.equals(other.row)) {
      return false;
    }
    if (!this.column.equals(other.column)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.row.toString());
    properties.push(this.column.toString());

    return properties.join(' ');
  }

  public getRow(): Row {
    return this.row;
  }

  public getColumn(): Column {
    return this.column;
  }
}
