import * as moment from 'moment';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsValue, StatsValueJSON } from '../StatsValue';

export class StatsValues {
  private values: Array<StatsValue>;

  public constructor(values: Array<StatsValue>) {
    this.values = values;
  }

  public get(index: number): StatsValue {
    const statsValue: StatsValue | undefined = this.values[index];

    if (statsValue === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return statsValue;
  }

  public set(statsValue: StatsValue): StatsValues {
    const newValues: Array<StatsValue> = [];
    let isSet: boolean = false;

    this.values.forEach((value: StatsValue): void => {
      if (isSet) {
        newValues.push(value);
        return;
      }
      if (statsValue.getAsOf().isSame(value.getAsOf())) {
        newValues.push(statsValue);
        isSet = true;
        return;
      }

      newValues.push(value);
    });

    if (!isSet) {
      newValues.push(statsValue);
      newValues.sort((statsValue1: StatsValue, statsValue2: StatsValue): number => {
        if (statsValue1.getAsOf().isBefore(statsValue2.getAsOf())) {
          return -1;
        }

        return 1;
      });
    }

    return new StatsValues(newValues);
  }

  public add(statsValue: StatsValue): StatsValues {
    return new StatsValues([...this.values, statsValue]);
  }

  public delete(asOf: moment.Moment): StatsValues {
    const newValues: Array<StatsValue> = this.values.filter((value: StatsValue): boolean => {
      if (asOf.isSame(value.getAsOf())) {
        return false;
      }

      return true;
    });

    return new StatsValues(newValues);
  }

  public length(): number {
    return this.values.length;
  }

  public forEach(consumer: (statsValue: StatsValue) => void): void {
    this.values.forEach(consumer);
  }

  public copy(): StatsValues {
    const values: Array<StatsValue> = [];

    this.values.forEach((statsValue: StatsValue): void => {
      values.push(statsValue);
    });

    return new StatsValues(values);
  }

  public equals(other: StatsValues): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.values.length;

    if (length !== other.length()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.values[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<StatsValueJSON> {
    return this.values.map<StatsValueJSON>((value: StatsValue): StatsValueJSON => {
      return value.toJSON();
    });
  }
}
