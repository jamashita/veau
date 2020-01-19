import { JSONable } from '../veau-general/JSONable';
import { ValueObject } from '../veau-general/ValueObject';
import { AsOf } from './AsOf';
import { NumericalValue } from './NumericalValue';
import { StatsItemID } from './StatsItemID';

export type StatsValueJSON = {
  asOf: string;
  value: number;
};

export type StatsValueRow = {
  statsItemID: string;
  asOf: string;
  value: number;
};

export class StatsValue extends ValueObject implements JSONable {
  private statsItemID: StatsItemID;
  private asOf: AsOf;
  private value: NumericalValue;

  public static of(statsItemID: StatsItemID, asOf: AsOf, value: NumericalValue): StatsValue {
    return new StatsValue(statsItemID, asOf, value);
  }

  public static ofJSON(statsItemID: StatsItemID, json: StatsValueJSON): StatsValue {
    const {
      asOf,
      value
    } = json;

    return StatsValue.of(statsItemID, AsOf.ofString(asOf), NumericalValue.of(value));
  }

  public static ofRow(row: StatsValueRow): StatsValue {
    const {
      statsItemID,
      asOf,
      value
    } = row;

    return StatsValue.of(StatsItemID.of(statsItemID), AsOf.ofString(asOf), NumericalValue.of(value));
  }

  private constructor(statsItemID: StatsItemID, asOf: AsOf, value: NumericalValue) {
    super();
    this.statsItemID = statsItemID;
    this.asOf = asOf;
    this.value = value;
  }

  public getStatsItemID(): StatsItemID {
    return this.statsItemID;
  }

  public getAsOf(): AsOf {
    return this.asOf;
  }

  public getValue(): NumericalValue {
    return this.value;
  }

  public getAsOfAsString(): string {
    return this.asOf.toString();
  }

  public isBefore(other: StatsValue): boolean {
    if (this.asOf.isBefore(other.getAsOf())) {
      return true;
    }

    return false;
  }

  public equals(other: StatsValue): boolean {
    if (this === other) {
      return true;
    }

    const {
      statsItemID,
      asOf,
      value
    } = this;

    if (!statsItemID.equals(other.getStatsItemID())) {
      return false;
    }
    if (!asOf.equals(other.getAsOf())) {
      return false;
    }
    if (!value.equals(other.getValue())) {
      return false;
    }

    return true;
  }

  public toJSON(): StatsValueJSON {
    const {
      asOf,
      value
    } = this;

    return {
      asOf: asOf.toString(),
      value: value.get()
    };
  }

  public toString(): string {
    const {
      statsItemID,
      asOf,
      value
    } = this;

    return `${statsItemID.toString()} ${asOf.toString()} ${value.toString()}`;
  }
}
