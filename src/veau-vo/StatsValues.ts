import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { AsOf } from './AsOf';
import { AsOfs } from './AsOfs';
import { NumericalValue } from './NumericalValue';
import { StatsItemID } from './StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues implements Collection<number, StatsValue>, JSONable {
  private values: Array<StatsValue>;

  public static of(values: Array<StatsValue>): StatsValues {
    return new StatsValues(values);
  }

  public static ofJSON(statsItemID: StatsItemID, statsValues: Array<StatsValueJSON>): StatsValues {
    return StatsValues.of(statsValues.map<StatsValue>((statsValue: StatsValueJSON): StatsValue => {
      return StatsValue.ofJSON(statsItemID, statsValue);
    }));
  }

  public static ofRow(statsValues: Array<StatsValueRow>): StatsValues {
    return StatsValues.of(statsValues.map<StatsValue>((statsValue: StatsValueRow): StatsValue => {
      return StatsValue.ofRow(statsValue);
    }));
  }

  public static empty(): StatsValues {
    return StatsValues.of([]);
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
      if (statsValue.getAsOf().equals(value.getAsOf())) {
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

  public delete(asOf: AsOf): StatsValues {
    const newValues: Array<StatsValue> = this.values.filter((value: StatsValue): boolean => {
      if (asOf.equals(value.getAsOf())) {
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

  public filter(statsItemID: StatsItemID): StatsValues {
    const values: Array<StatsValue> = this.values.filter((value: StatsValue): boolean => {
      if(statsItemID.equals(value.getStatsItemID())) {
        return true;
      }

      return false;
    });

    return StatsValues.of(values);
  }

  public getValues(): Array<NumericalValue> {
    return this.values.map<NumericalValue>((value: StatsValue): NumericalValue => {
      return value.getValue();
    });
  }

  public getAsOfs(): AsOfs {
    const asOfs: Array<AsOf> = this.values.map<AsOf>((value: StatsValue): AsOf => {
      return value.getAsOf();
    });

    return AsOfs.of(asOfs);
  }

  public isEmpty(): boolean {
    if (this.values.length === 0) {
      return true;
    }

    return false;
  }

  public copy(): StatsValues {
    return StatsValues.of([
      ...this.values
    ]);
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
