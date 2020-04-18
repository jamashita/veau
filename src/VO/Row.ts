import { RowError } from '../Error/RowError';
import { ValueObject } from '../General/Object/ValueObject';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';

const ORIGIN_VALUE: number = 0;

export class Row extends ValueObject {
  public readonly noun: 'Row' = 'Row';
  private readonly row: number;

  private static readonly ORIGIN: Row = new Row(ORIGIN_VALUE);

  public static of(row: number): Superposition<Row, RowError> {
    if (row < 0) {
      return Failure.of<Row, RowError>(new RowError(`ILLEGAL ROW SPECIFIED ${row}`));
    }
    if (row === ORIGIN_VALUE) {
      return Success.of<Row, RowError>(Row.origin());
    }
    if (Type.isInteger(row)) {
      return Success.of<Row, RowError>(new Row(row));
    }

    return Failure.of<Row, RowError>(new RowError('ILLEGAL ROW SPECIFIED'));
  }

  public static origin(): Row {
    return Row.ORIGIN;
  }

  protected constructor(row: number) {
    super();
    this.row = row;
  }

  public get(): number {
    return this.row;
  }

  public isOrigin(): boolean {
    if (this === Row.origin()) {
      return true;
    }

    return false;
  }

  public equals(other: Row): boolean {
    if (this === other) {
      return true;
    }
    if (this.row === other.row) {
      return true;
    }

    return false;
  }

  protected serialize(): string {
    return `${this.row}`;
  }
}
