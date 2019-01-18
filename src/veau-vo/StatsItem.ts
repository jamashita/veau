import {ValueObject} from './ValueObject';

export type StatsItemJSON = {
  asOf: string;
  value: number;
};

export type StatsItemRow = {
  statsID: string;
  asOf: string;
  value: number;
};

export class StatsItem extends ValueObject {
  private asOf: string;
  private value: number;

  public static of(asOf: string, value: number): StatsItem {
    return new StatsItem(asOf, value);
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

  public equals(other: StatsItem): boolean {
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

  public toJSON(): StatsItemJSON {
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
    return `${this.asOf} : ${this.value}`;
  }
}
