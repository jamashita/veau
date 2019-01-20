import { ValueObject } from './ValueObject';

export type StatsValueJSON = {
  asOf: string;
  value: number;
};

export type StatsValueRow = {
  statsItemID: string;
  asOf: string;
  value: number;
};

export class StatsValue extends ValueObject {
  private asOf: string;
  private value: number;

  public static of(asOf: string, value: number): StatsValue {
    return new StatsValue(asOf, value);
  }

  private constructor(asOf: string, value: number) {
    super();
    this.asOf = asOf;
    this.value = value;
  }

  public getAsOf(): string {
    return this.asOf;
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: StatsValue): boolean {
    if (this === other) {
      return true;
    }
    if (this.asOf !== other.getAsOf()) {
      return false;
    }
    if (this.value !== other.getValue()) {
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
      asOf,
      value
    };
  }

  public toString(): string {
    const {
      asOf,
      value
    } = this;

    return `${asOf} : ${value}`;
  }
}
