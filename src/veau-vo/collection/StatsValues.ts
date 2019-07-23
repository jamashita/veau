import * as moment from 'moment';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsValue, StatsValueJSON } from '../StatsValue';

export class StatsValues {
  private values: Array<StatsValue>;

  public static of(values: Array<StatsValue>): StatsValues {
    return new StatsValues(values);
  }

  public static ofJSON(statsValues: Array<StatsValueJSON>): StatsValues {
    return StatsValues.of(statsValues.map<StatsValue>((statsValue: StatsValueJSON): StatsValue => {
      const {
        asOf,
        value
      } = statsValue;

      return StatsValue.of(moment(asOf), value);
    }));
  }

  private constructor(values: Array<StatsValue>) {
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

  public map<U>(func: (statsValue: StatsValue, index: number) => U): Array<U> {
    return this.values.map<U>(func);
  }

  public getValues(): Array<number> {
    return this.values.map<number>((value: StatsValue): number => {
      return value.getValue();
    });
  }

  public getAsOfs(): Array<moment.Moment> {
    return this.values.map<moment.Moment>((value: StatsValue): moment.Moment => {
      return value.getAsOf();
    });
  }

  public copy(): StatsValues {
    return new StatsValues(this.values.map<StatsValue>((statsValue: StatsValue): StatsValue => {
      return statsValue;
    }));
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

  public toString(): string {
    return this.values.map<string>((value: StatsValue): string => {
      return value.toString();
    }).join(', ');
  }
}
