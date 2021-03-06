import { JSONable } from '@jamashita/publikum-interface';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';
import { AsOf } from '../AsOf/AsOf';
import { AsOfError } from '../AsOf/Error/AsOfError';
import { NumericalValue } from '../NumericalValue/NumericalValue';
import { ValueContained } from '../NumericalValue/ValueContained';
import { StatsValueError } from './Error/StatsValueError';

export type StatsValueJSON = Readonly<{
  asOf: string;
  value: number;
}>;
export type StatsValueRow = Readonly<{
  statsItemID: string;
  asOf: string;
  value: number;
}>;

export class StatsValue extends ValueObject<'StatsValue'> implements JSONable<StatsValueJSON> {
  public readonly noun: 'StatsValue' = 'StatsValue';
  private readonly asOf: AsOf;
  private readonly value: NumericalValue;

  public static of(asOf: AsOf, value: NumericalValue): StatsValue {
    return new StatsValue(asOf, value);
  }

  public static ofJSON(json: StatsValueJSON): StatsValue {
    try {
      return StatsValue.of(AsOf.ofString(json.asOf), ValueContained.of(json.value));
    }
    catch (err: unknown) {
      if (err instanceof AsOfError) {
        throw new StatsValueError('StatsValue.ofRow()', err);
      }

      throw err;
    }
  }

  public static ofRow(row: StatsValueRow): StatsValue {
    try {
      return StatsValue.of(AsOf.ofString(row.asOf), ValueContained.of(row.value));
    }
    catch (err: unknown) {
      if (err instanceof AsOfError) {
        throw new StatsValueError('StatsValue.ofRow()', err);
      }

      throw err;
    }
  }

  public static validate(n: unknown): n is StatsValueJSON {
    if (!Kind.isObject<StatsValueJSON>(n)) {
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

  public getAsOf(): AsOf {
    return this.asOf;
  }

  public getValue(): NumericalValue {
    return this.value;
  }
}
