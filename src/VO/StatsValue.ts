import { AsOfError } from '../Error/AsOfError';
import { StatsItemIDError } from '../Error/StatsItemIDError';
import { StatsValueError } from '../Error/StatsValueError';
import { JSONable } from '../General/Interface/JSONable';
import { ValueObject } from '../General/Object/ValueObject';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';
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

  public static of(
    statsItemID: StatsItemID,
    asOf: AsOf,
    value: NumericalValue
  ): StatsValue {
    return new StatsValue(statsItemID, asOf, value);
  }

  public static ofJSON(statsItemID: StatsItemID, json: StatsValueJSON): Superposition<StatsValue, StatsValueError> {
    return AsOf.ofString(json.asOf).match<StatsValue, StatsValueError>((asOf: AsOf) => {
      return Success.of<StatsValue, StatsValueError>(
        StatsValue.of(
          statsItemID,
          asOf,
          NumericalValue.of(json.value)
        )
      );
    }, (err: AsOfError) => {
      return Failure.of<StatsValue, StatsValueError>(
        new StatsValueError('StatsValue.ofRow()', err)
      );
    });
  }

  public static ofRow(row: StatsValueRow): Superposition<StatsValue, StatsValueError> {
    return StatsItemID.ofString(row.statsItemID).match<StatsValue, StatsValueError>((statsItemID: StatsItemID) => {
      return AsOf.ofString(row.asOf).match<StatsValue, StatsValueError>((asOf: AsOf) => {
        return Success.of<StatsValue, StatsValueError>(
          StatsValue.of(
            statsItemID,
            asOf,
            NumericalValue.of(row.value)
          )
        );
      }, (err: AsOfError) => {
        return Failure.of<StatsValue, StatsValueError>(
          new StatsValueError('StatsValue.ofRow()', err)
        );
      });
    }, (err: StatsItemIDError) => {
      return Failure.of<StatsValue, StatsValueError>(
        new StatsValueError('StatsValue.ofRow()', err)
      );
    });
  }

  public static isJSON(n: unknown): n is StatsValueJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }
    if (!Type.isString(n.asOf)) {
      return false;
    }
    if (!Type.isNumber(n.value)) {
      return false;
    }

    return true;
  }

  protected constructor(
    statsItemID: StatsItemID,
    asOf: AsOf,
    value: NumericalValue
  ) {
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
    if (!this.statsItemID.equals(other.statsItemID)) {
      return false;
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

    properties.push(this.statsItemID.toString());
    properties.push(this.asOf.toString());
    properties.push(this.value.toString());

    return properties.join(' ');
  }
}
