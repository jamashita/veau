import { Alive, Dead, JSONable, Kind, Superposition, ValueObject } from 'publikum';

import { AsOfError } from '../AsOf/Error/AsOfError';
import { StatsValueError } from './Error/StatsValueError';
import { AsOf } from '../AsOf/AsOf';
import { NumericalValue } from '../NumericalValue/NumericalValue';

export type StatsValueJSON = Readonly<{
  asOf: string;
  value: number;
}>;
export type StatsValueRow = Readonly<{
  statsItemID: string;
  asOf: string;
  value: number;
}>;

export class StatsValue extends ValueObject implements JSONable {
  public readonly noun: 'StatsValue' = 'StatsValue';
  private readonly asOf: AsOf;
  private readonly value: NumericalValue;

  public static of(asOf: AsOf, value: NumericalValue): StatsValue {
    return new StatsValue(asOf, value);
  }

  public static ofJSON(json: StatsValueJSON): Superposition<StatsValue, StatsValueError> {
    return AsOf.ofString(json.asOf).match<StatsValue, StatsValueError>(
      (asOf: AsOf) => {
        return Alive.of<StatsValue, StatsValueError>(StatsValue.of(asOf, NumericalValue.of(json.value)));
      },
      (err: AsOfError) => {
        return Dead.of<StatsValue, StatsValueError>(new StatsValueError('StatsValue.ofRow()', err));
      }
    );
  }

  public static ofRow(row: StatsValueRow): Superposition<StatsValue, StatsValueError> {
    return AsOf.ofString(row.asOf).match<StatsValue, StatsValueError>(
      (asOf: AsOf) => {
        return Alive.of<StatsValue, StatsValueError>(StatsValue.of(asOf, NumericalValue.of(row.value)));
      },
      (err: AsOfError) => {
        return Dead.of<StatsValue, StatsValueError>(new StatsValueError('StatsValue.ofRow()', err));
      }
    );
  }

  public static isJSON(n: unknown): n is StatsValueJSON {
    if (!Kind.isPlainObject(n)) {
      return false;
    }
    if (!Kind.isString(n.asOf)) {
      return false;
    }
    if (!Kind.isNumber(n.value)) {
      return false;
    }

    return true;
  }

  protected constructor(asOf: AsOf, value: NumericalValue) {
    super();
    this.asOf = asOf;
    this.value = value;
  }

  public getAsOf(): AsOf {
    return this.asOf;
  }

  public getValue(): NumericalValue {
    return this.value;
  }

  public equals(other: StatsValue): boolean {
    if (this === other) {
      return true;
    }
    if (!this.asOf.equals(other.asOf)) {
      return false;
    }
    if (!this.value.equals(other.value)) {
      return false;
    }

    return true;
  }

  public toJSON(): StatsValueJSON {
    return {
      asOf: this.asOf.toString(),
      value: this.value.get()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.asOf.toString());
    properties.push(this.value.toString());

    return properties.join(' ');
  }
}
