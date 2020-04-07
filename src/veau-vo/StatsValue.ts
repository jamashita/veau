import { AsOfError } from '../veau-error/AsOfError';
import { StatsItemIDError } from '../veau-error/StatsItemIDError';
import { StatsValueError } from '../veau-error/StatsValueError';
import { JSONable } from '../veau-general/JSONable';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';
import { AsOf } from './AsOf';
import { NumericalValue } from './NumericalValue';
import { StatsItemID } from './StatsItemID';

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
  // TODO REMOVE
  private readonly statsItemID: StatsItemID;
  private readonly asOf: AsOf;
  private readonly value: NumericalValue;

  public static of(statsItemID: StatsItemID, asOf: AsOf, value: NumericalValue): StatsValue {
    return new StatsValue(statsItemID, asOf, value);
  }

  public static ofJSON(statsItemID: StatsItemID, json: StatsValueJSON): Try<StatsValue, StatsValueError> {
    const {
      asOf,
      value
    } = json;

    return AsOf.ofString(asOf).match<Try<StatsValue, StatsValueError>>((of: AsOf) => {
      return Success.of<StatsValue, StatsValueError>(StatsValue.of(statsItemID, of, NumericalValue.of(value)));
    }, (err: AsOfError) => {
      return Failure.of<StatsValue, StatsValueError>(new StatsValueError(err.message));
    });
  }

  public static ofRow(row: StatsValueRow): Try<StatsValue, StatsValueError> {
    const {
      statsItemID,
      asOf,
      value
    } = row;

    return StatsItemID.ofString(statsItemID).match<Try<StatsValue, StatsValueError>>((id: StatsItemID) => {
      return AsOf.ofString(asOf).match<Try<StatsValue, StatsValueError>>((of: AsOf) => {
        return Success.of<StatsValue, StatsValueError>(StatsValue.of(id, of, NumericalValue.of(value)));
      }, (err: AsOfError) => {
        return Failure.of<StatsValue, StatsValueError>(new StatsValueError(err.message));
      });
    }, (err: StatsItemIDError) => {
      return Failure.of<StatsValue, StatsValueError>(new StatsValueError(err.message));
    });
  }

  public static isJSON(n: unknown): n is StatsValueJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }

    const {
      asOf,
      value
    } = n;

    if (!Type.isString(asOf)) {
      return false;
    }
    if (!Type.isNumber(value)) {
      return false;
    }

    return true;
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

  public isBefore(other: StatsValue): boolean {
    return this.asOf.isBefore(other.getAsOf());
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
