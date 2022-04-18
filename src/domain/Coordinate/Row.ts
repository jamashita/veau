import { ValueObject } from '@jamashita/anden-object';
import { Kind } from '@jamashita/anden-type';
import { CoordinateError } from './CoordinateError';

const ORIGIN_VALUE: number = 0;

export class Row extends ValueObject {
  private readonly row: number;

  private static readonly ORIGIN: Row = new Row(ORIGIN_VALUE);

  public static of(row: number): Row {
    if (row < 0) {
      throw new CoordinateError(`ILLEGAL ROW SPECIFIED ${row}`);
    }
    if (row === ORIGIN_VALUE) {
      return Row.origin();
    }
    if (Kind.isInteger(row)) {
      return new Row(row);
    }

    throw new CoordinateError(`ILLEGAL ROW SPECIFIED: ${row}`);
  }

  public static origin(): Row {
    return Row.ORIGIN;
  }

  protected constructor(row: number) {
    super();
    this.row = row;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Row)) {
      return false;
    }

    return this.row === other.row;
  }

  public serialize(): string {
    return `${this.row}`;
  }

  public get(): number {
    return this.row;
  }

  public isOrigin(): boolean {
    return this === Row.origin();
  }
}
