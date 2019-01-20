import * as moment from 'moment';
import { ValueObject } from './ValueObject';

export type StatsValueJSON = {
  asOf: string;
  value: number;
};

export type StatsValueRow = {
  statsItemID: string;
  asOf: Date;
  value: number;
};

const DATE_FORMAT: string = 'YYYY-MM-DD';

export class StatsValue extends ValueObject {
  private asOf: moment.Moment;
  private value: number;

  public static of(asOf: moment.Moment, value: number): StatsValue {
    return new StatsValue(asOf, value);
  }

  private constructor(asOf: moment.Moment, value: number) {
    super();
    this.asOf = asOf;
    this.value = value;
  }

  public getAsOf(): moment.Moment {
    return this.asOf;
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: StatsValue): boolean {
    if (this === other) {
      return true;
    }
    if (this.asOf.get('days') !== other.getAsOf().get('days')) {
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
      asOf: asOf.format(DATE_FORMAT),
      value
    };
  }

  public toString(): string {
    const {
      asOf,
      value
    } = this;

    return `${asOf.format(DATE_FORMAT)} : ${value}`;
  }
}
