import * as moment from 'moment';
import { ValueObject } from './ValueObject';

const TERM_FORMAT: string = 'YYYY-MM-DD';

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
  private asOf: moment.Moment;
  private value: number;

  public static of(asOf: moment.Moment, value: number): StatsValue {
    return new StatsValue(asOf, value);
  }

  private constructor(asOf: moment.Moment, value: number) {
    super();
    this.asOf = moment(asOf);
    this.value = value;
  }

  public getAsOf(): moment.Moment {
    return moment(this.asOf);
  }

  public getValue(): number {
    return this.value;
  }

  public getAsOfAsString(): string {
    return this.asOf.format(TERM_FORMAT);
  }

  public equals(other: StatsValue): boolean {
    if (this === other) {
      return true;
    }
    if (!this.asOf.isSame(other.getAsOf())) {
      return false;
    }
    if (this.value !== other.getValue()) {
      return false;
    }

    return true;
  }

  public toJSON(): StatsValueJSON {
    const {
      value
    } = this;

    return {
      asOf: this.getAsOfAsString(),
      value
    };
  }

  public toString(): string {
    const {
      value
    } = this;

    return `${this.getAsOfAsString()} : ${value}`;
  }
}
