import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { ColumnError } from './Error/ColumnError';

const ORIGIN_VALUE: number = 0;

export class Column extends ValueObject<Column, 'Column'> {
  public readonly noun: 'Column' = 'Column';
  private readonly column: number;

  private static readonly ORIGIN: Column = new Column(ORIGIN_VALUE);

  public static of(column: number): Superposition<Column, ColumnError> {
    if (column < 0) {
      return Superposition.dead<Column, ColumnError>(new ColumnError(`ILLEGAL COLUMN SPECIFIED ${column}`), ColumnError);
    }
    if (column === ORIGIN_VALUE) {
      return Superposition.alive<Column, ColumnError>(Column.origin(), ColumnError);
    }
    if (Kind.isInteger(column)) {
      return Superposition.alive<Column, ColumnError>(new Column(column), ColumnError);
    }

    return Superposition.dead<Column, ColumnError>(new ColumnError('ILLEGAL COLUMN SPECIFIED'), ColumnError);
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
