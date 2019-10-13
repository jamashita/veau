import moment from 'moment';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { StatsValue, StatsValueJSON } from './StatsValue';

export class StatsValues implements Collection<number, StatsValue>, JSONable {
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

  public contains(value: StatsValue): boolean {
    const found: StatsValue | undefined = this.values.find((statsValue: StatsValue): boolean => {
      if (value.equals(statsValue)) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.values.length;
  }

  public forEach(enumerator: Enumerator<number, StatsValue>): void {
    this.values.forEach(enumerator);
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

  public isEmpty(): boolean {
    if (this.values.length === 0) {
      return true;
    }

    return false;
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
    if (length !== other.size()) {
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