import { StatsValueError } from '../veau-error/StatsValueError';
import { StatsValuesError } from '../veau-error/StatsValuesError';
import { Cloneable } from '../veau-general/Cloneable';
import { Collection } from '../veau-general/Collection/Collection';
import { Sequence } from '../veau-general/Collection/Sequence';
import { JSONable } from '../veau-general/JSONable';
import { Optional } from '../veau-general/Optional/Optional';
import { Failure } from '../veau-general/Try/Failure';
import { manoeuvre } from '../veau-general/Try/Manoeuvre';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Enumerator } from '../veau-general/Type/Function';
import { Type } from '../veau-general/Type/Type';
import { AsOf } from './AsOf';
import { AsOfs } from './AsOfs';
import { NumericalValue } from './NumericalValue';
import { NumericalValues } from './NumericalValues';
import { StatsItemID } from './StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues implements Collection<number, StatsValue>, JSONable, Cloneable {
  public readonly noun: 'StatsValues' = 'StatsValues';
  private readonly values: Sequence<StatsValue>;

  public static of(values: Sequence<StatsValue>): StatsValues {
    return new StatsValues(values);
  }

  public static ofArray(values: Array<StatsValue>): StatsValues {
    return StatsValues.of(Sequence.of<StatsValue>(values));
  }

  public static ofSpread(...values: Array<StatsValue>): StatsValues {
    return StatsValues.ofArray(values);
  }

  public static ofTry(tries: Array<Try<StatsValue, StatsValueError>>): Try<StatsValues, StatsValuesError> {
    return manoeuvre<StatsValue, StatsValueError>(tries).match<Try<StatsValues, StatsValuesError>>((values: Array<StatsValue>) => {
      return Success.of<StatsValues, StatsValuesError>(StatsValues.ofArray(values));
    }, (err: StatsValueError) => {
      return Failure.of<StatsValues, StatsValuesError>(new StatsValuesError(err.message));
    });
  }

  public static ofJSON(statsItemID: StatsItemID, statsValues: Array<StatsValueJSON>): Try<StatsValues, StatsValuesError> {
    const tries: Array<Try<StatsValue, StatsValueError>> = statsValues.map<Try<StatsValue, StatsValueError>>((statsValue: StatsValueJSON) => {
      return StatsValue.ofJSON(statsItemID, statsValue);
    });

    return StatsValues.ofTry(tries);
  }

  public static ofRow(statsValues: Array<StatsValueRow>): Try<StatsValues, StatsValuesError> {
    const tries: Array<Try<StatsValue, StatsValueError>> = statsValues.map<Try<StatsValue, StatsValueError>>((statsValue: StatsValueRow) => {
      return StatsValue.ofRow(statsValue);
    });

    return StatsValues.ofTry(tries);
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
    return StatsValues.ofArray([
    ]);
  }

  protected constructor(values: Sequence<StatsValue>) {
    this.values = values;
  }

  public get(index: number): Optional<StatsValue> {
    return this.values.get(index);
  }

  public set(statsValue: StatsValue): StatsValues {
    const newValues: Array<StatsValue> = [];
    let isSet: boolean = false;

    this.values.iterate((value: StatsValue) => {
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

    return StatsValues.ofArray(newValues);
  }

  public delete(asOf: AsOf): StatsValues {
    const newValues: Sequence<StatsValue> = this.values.screen((value: StatsValue) => {
      return !asOf.equals(value.getAsOf());
    });

    return StatsValues.of(newValues);
  }

  public contains(value: StatsValue): boolean {
    return this.values.contains(value);
  }

  public size(): number {
    return this.values.size();
  }

  public forEach(iteration: Enumerator<number, StatsValue>): void {
    this.values.iterate(iteration);
  }

  public filter(statsItemID: StatsItemID): StatsValues {
    const values: Sequence<StatsValue> = this.values.screen((value: StatsValue) => {
      return statsItemID.equals(value.getStatsItemID());
    });

    return StatsValues.of(values);
  }

  public getValues(): NumericalValues {
    const values: Sequence<NumericalValue> = this.values.project<NumericalValue>((value: StatsValue) => {
      return value.getValue();
    });

    return NumericalValues.of(values);
  }

  public getAsOfs(): AsOfs {
    const asOfs: Sequence<AsOf> = this.values.project<AsOf>((value: StatsValue) => {
      return value.getAsOf();
    });

    return AsOfs.of(asOfs);
  }

  public isEmpty(): boolean {
    return this.values.isEmpty();
  }

  public copy(): StatsValues {
    return StatsValues.of(this.values.copy());
  }

  public equals(other: StatsValues): boolean {
    if (this === other) {
      return true;
    }

    return this.values.equals(other.values);
  }

  public toJSON(): Array<StatsValueJSON> {
    return this.values.toArray().map<StatsValueJSON>((value: StatsValue) => {
      return value.toJSON();
    });
  }

  public toString(): string {
    return this.values.toArray().map<string>((value: StatsValue) => {
      return value.toString();
    }).join(', ');
  }
}
