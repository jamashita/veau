import { StatsValueError } from '../Error/StatsValueError';
import { StatsValuesError } from '../Error/StatsValuesError';
import { ImmutableSequence } from '../General/Collection/Sequence/ImmutableSequence';
import { Sequence } from '../General/Collection/Sequence/Interface/Sequence';
import { Cloneable } from '../General/Interface/Cloneable';
import { Collection } from '../General/Interface/Collection';
import { JSONable } from '../General/Interface/JSONable';
import { Quantum } from '../General/Quantum/Quantum';
import { Failure } from '../General/Superposition/Failure';
import { manoeuvre } from '../General/Superposition/Manoeuvre';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Enumerator } from '../General/Type/Function';
import { Type } from '../General/Type/Type';
import { AsOf } from './AsOf';
import { AsOfs } from './AsOfs';
import { NumericalValue } from './NumericalValue';
import { NumericalValues } from './NumericalValues';
import { StatsItemID } from './StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues implements Collection<number, StatsValue>, JSONable, Cloneable {
  public readonly noun: 'StatsValues' = 'StatsValues';
  private readonly values: Sequence<StatsValue>;

  private static readonly EMPTY: StatsValues = new StatsValues(ImmutableSequence.empty<StatsValue>());

  public static of(values: Sequence<StatsValue>): StatsValues {
    if (values.isEmpty()) {
      return StatsValues.empty();
    }

    return new StatsValues(values);
  }

  public static ofArray(values: Array<StatsValue>): StatsValues {
    return StatsValues.of(ImmutableSequence.of<StatsValue>(values));
  }

  public static ofSpread(...values: Array<StatsValue>): StatsValues {
    return StatsValues.ofArray(values);
  }

  public static ofTry(tries: Array<Superposition<StatsValue, StatsValueError>>): Superposition<StatsValues, StatsValuesError> {
    return manoeuvre<StatsValue, StatsValueError>(tries).match<StatsValues, StatsValuesError>((values: Array<StatsValue>) => {
      return Success.of<StatsValues, StatsValuesError>(StatsValues.ofArray(values));
    }, (err: StatsValueError) => {
      return Failure.of<StatsValues, StatsValuesError>(new StatsValuesError('StatsValues.ofTry()', err));
    });
  }

  public static ofJSON(statsItemID: StatsItemID, statsValues: Array<StatsValueJSON>): Superposition<StatsValues, StatsValuesError> {
    const tries: Array<Superposition<StatsValue, StatsValueError>> = statsValues.map<Superposition<StatsValue, StatsValueError>>((statsValue: StatsValueJSON) => {
      return StatsValue.ofJSON(statsItemID, statsValue);
    });

    return StatsValues.ofTry(tries);
  }

  public static ofRow(rows: Array<StatsValueRow>): Superposition<StatsValues, StatsValuesError> {
    const tries: Array<Superposition<StatsValue, StatsValueError>> = rows.map<Superposition<StatsValue, StatsValueError>>((statsValue: StatsValueRow) => {
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
    return StatsValues.EMPTY;
  }

  protected constructor(values: Sequence<StatsValue>) {
    this.values = values;
  }

  public get(index: number): Quantum<StatsValue> {
    return this.values.get(index);
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

    return StatsValues.ofArray(newValues);
  }

  public delete(asOf: AsOf): StatsValues {
    const newValues: Sequence<StatsValue> = this.values.filter((value: StatsValue) => {
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
    this.values.forEach(iteration);
  }

  public filter(statsItemID: StatsItemID): StatsValues {
    const values: Sequence<StatsValue> = this.values.filter((value: StatsValue) => {
      return statsItemID.equals(value.getStatsItemID());
    });

    return StatsValues.of(values);
  }

  public getValues(): NumericalValues {
    const values: Sequence<NumericalValue> = this.values.map<NumericalValue>((value: StatsValue) => {
      return value.getValue();
    });

    return NumericalValues.of(values);
  }

  public getAsOfs(): AsOfs {
    const asOfs: Sequence<AsOf> = this.values.map<AsOf>((value: StatsValue) => {
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
