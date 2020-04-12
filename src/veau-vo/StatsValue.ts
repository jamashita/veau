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
    return AsOf.ofString(json.asOf).match<Try<StatsValue, StatsValueError>>((asOf: AsOf) => {
      return Success.of<StatsValue, StatsValueError>(StatsValue.of(statsItemID, asOf, NumericalValue.of(json.value)));
    }, (err: AsOfError) => {
      return Failure.of<StatsValue, StatsValueError>(new StatsValueError(err.message));
    });
  }

  public static ofRow(row: StatsValueRow): Try<StatsValue, StatsValueError> {
    return StatsItemID.ofString(row.statsItemID).match<Try<StatsValue, StatsValueError>>((statsItemID: StatsItemID) => {
      return AsOf.ofString(row.asOf).match<Try<StatsValue, StatsValueError>>((asOf: AsOf) => {
        return Success.of<StatsValue, StatsValueError>(
          StatsValue.of(
            statsItemID,
            asOf,
            NumericalValue.of(row.value)
          )
        );
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

  protected constructor(statsItemID: StatsItemID, asOf: AsOf, value: NumericalValue) {
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

  public equals(other: StatsValue): boolean {
    if (this === other) {
      return true;
    }

    const {
      statsItemID,
      asOf,
      value
    } = this;

    if (!statsItemID.equals(other.statsItemID)) {
      return false;
    }
    if (!asOf.equals(other.asOf)) {
      return false;
    }
    if (!value.equals(other.value)) {
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
