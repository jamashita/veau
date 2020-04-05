import { StatsValueError } from '../veau-error/StatsValueError';
import { StatsValuesError } from '../veau-error/StatsValuesError';
import { Cloneable } from '../veau-general/Cloneable';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { Type } from '../veau-general/Type/Type';
import { AsOf } from './AsOf';
import { AsOfs } from './AsOfs';
import { NumericalValue } from './NumericalValue';
import { StatsItemID } from './StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues implements Collection<number, StatsValue>, JSONable, Cloneable {
  public readonly noun: 'StatsValues' = 'StatsValues';
  private readonly values: Array<StatsValue>;

  public static of(values: Array<StatsValue>): StatsValues {
    return new StatsValues(values);
  }

  public static ofTry(tries: Array<Try<StatsValue, StatsValueError>>): Try<StatsValues, StatsValuesError> {
    const failures: Array<Failure<StatsValue, StatsValueError>> = tries.filter((trial: Try<StatsValue, StatsValueError>): trial is Failure<StatsValue, StatsValueError> => {
      return trial.isFailure();
    });

    if (failures.length !== 0) {
      const message: string = failures.map<string>((failure: Failure<StatsValue, StatsValueError>) => {
        return failure.getMessage();
      }).join(': ');

      return Failure.of<StatsValues, StatsValuesError>(new StatsValuesError(message));
    }

    const values: Array<StatsValue> = tries.map<StatsValue>((trial: Try<StatsValue, StatsValueError>) => {
      return trial.get();
    });

    return Success.of<StatsValues, StatsValuesError>(StatsValues.of(values));
  }

  public static ofJSON(statsItemID: StatsItemID, statsValues: Array<StatsValueJSON>): Try<StatsValues, StatsValuesError> {
    const trials: Array<Try<StatsValue, StatsValueError>> = statsValues.map<Try<StatsValue, StatsValueError>>((statsValue: StatsValueJSON) => {
      return StatsValue.ofJSON(statsItemID, statsValue);
    });

    return StatsValues.ofTry(trials);
  }

  public static ofRow(statsValues: Array<StatsValueRow>): Try<StatsValues, StatsValuesError> {
    const trials: Array<Try<StatsValue, StatsValueError>> = statsValues.map<Try<StatsValue, StatsValueError>>((statsValue: StatsValueRow) => {
      return StatsValue.ofRow(statsValue);
    });

    return StatsValues.ofTry(trials);
  }

  public static isJSON(n: unknown): n is Array<StatsValueJSON> {
    if (!Type.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsValue.isJSON(o);
    });
  }

  public static empty(): StatsValues {
    return StatsValues.of([]);
  }

  private constructor(values: Array<StatsValue>) {
    this.values = values;
  }

  public get(index: number): Optional<StatsValue> {
    const statsValue: StatsValue | undefined = this.values[index];

    if (statsValue === undefined) {
      return None.of<StatsValue>();
    }

    return Some.of<StatsValue>(statsValue);
  }

  public set(statsValue: StatsValue): StatsValues {
    const newValues: Array<StatsValue> = [];
    let isSet: boolean = false;

    this.values.forEach((value: StatsValue) => {
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
      newValues.sort((statsValue1: StatsValue, statsValue2: StatsValue) => {
        if (statsValue1.getAsOf().isBefore(statsValue2.getAsOf())) {
          return -1;
        }

        return 1;
      });
    }

    return new StatsValues(newValues);
  }

  public delete(asOf: AsOf): StatsValues {
    const newValues: Array<StatsValue> = this.values.filter((value: StatsValue) => {
      return !asOf.equals(value.getAsOf());
    });

    return new StatsValues(newValues);
  }

  public contains(value: StatsValue): boolean {
    const found: StatsValue | undefined = this.values.find((statsValue: StatsValue) => {
      return value.equals(statsValue);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.values.length;
  }

  public forEach(iteration: Enumerator<number, StatsValue>): void {
    this.values.forEach(iteration);
  }

  public filter(statsItemID: StatsItemID): StatsValues {
    const values: Array<StatsValue> = this.values.filter((value: StatsValue) => {
      return statsItemID.equals(value.getStatsItemID());
    });

    return StatsValues.of(values);
  }

  public getValues(): Array<NumericalValue> {
    return this.values.map<NumericalValue>((value: StatsValue) => {
      return value.getValue();
    });
  }

  public getAsOfs(): AsOfs {
    const asOfs: Array<AsOf> = this.values.map<AsOf>((value: StatsValue) => {
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
      if (!this.values[i].equals(other.get(i).get())) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<StatsValueJSON> {
    return this.values.map<StatsValueJSON>((value: StatsValue) => {
      return value.toJSON();
    });
  }

  public toString(): string {
    return this.values.map<string>((value: StatsValue) => {
      return value.toString();
    }).join(', ');
  }
}
