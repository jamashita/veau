import { ValueObject } from '@jamashita/anden-object';
import { Kind } from '@jamashita/anden-type';
import { ColumnError } from './error/ColumnError.js';

const ORIGIN_VALUE: number = 0;

export class Column extends ValueObject<'Column'> {
  public readonly noun: 'Column' = 'Column';
  private readonly column: number;

  private static readonly ORIGIN: Column = new Column(ORIGIN_VALUE);

  public static of(column: number): Column {
    if (column < 0) {
      throw new ColumnError(`ILLEGAL COLUMN SPECIFIED ${column}`);
    }
    if (column === ORIGIN_VALUE) {
      return Column.origin();
    }
    if (Kind.isInteger(column)) {
      return new Column(column);
    }

    throw new ColumnError(`ILLEGAL COLUMN SPECIFIED: ${column}`);
  }

  public static origin(): Column {
    return Column.ORIGIN;
  }

  protected constructor(column: number) {
    super();
    this.column = column;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Column)) {
      return false;
    }
    if (this.column === other.column) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.column}`;
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
}
