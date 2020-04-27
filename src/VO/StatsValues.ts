import {
  Address,
  Alive,
  Cloneable,
  Collection,
  Dead,
  Enumerator,
  ImmutableAddress,
  JSONable,
  Kind,
  manoeuvre,
  Objet,
  Quantum,
  Superposition
} from 'publikum';
import { StatsValueError } from '../Error/StatsValueError';
import { StatsValuesError } from '../Error/StatsValuesError';
import { AsOf } from './AsOf';
import { AsOfs } from './AsOfs';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues extends Objet implements Collection<void, StatsValue>, Cloneable<StatsValues>, JSONable {
  public readonly noun: 'StatsValues' = 'StatsValues';
  private readonly values: Address<StatsValue>;

  private static readonly EMPTY: StatsValues = new StatsValues(ImmutableAddress.empty<StatsValue>());

  public static of(values: Address<StatsValue>): StatsValues {
    if (values.isEmpty()) {
      return StatsValues.empty();
    }

    return new StatsValues(values);
  }

  public static ofSet(values: Set<StatsValue>): StatsValues {
    return StatsValues.of(ImmutableAddress.of<StatsValue>(values));
  }

  public static ofArray(values: Array<StatsValue>): StatsValues {
    return StatsValues.ofSet(new Set(values));
  }

  public static ofSpread(...values: Array<StatsValue>): StatsValues {
    return StatsValues.ofArray(values);
  }

  public static ofSuperposition(superpositions: Array<Superposition<StatsValue, StatsValueError>>): Superposition<StatsValues, StatsValuesError> {
    return manoeuvre<StatsValue, StatsValueError>(superpositions).match<StatsValues, StatsValuesError>((values: Array<StatsValue>) => {
      return Alive.of<StatsValues, StatsValuesError>(
        StatsValues.ofArray(values)
      );
    }, (err: StatsValueError) => {
      return Dead.of<StatsValues, StatsValuesError>(
        new StatsValuesError('StatsValues.ofSuperposition()', err)
      );
    });
  }

  public static ofJSON(json: Array<StatsValueJSON>): Superposition<StatsValues, StatsValuesError> {
    const superpositions: Array<Superposition<StatsValue, StatsValueError>> = json.map<Superposition<StatsValue, StatsValueError>>((statsValue: StatsValueJSON) => {
      return StatsValue.ofJSON(statsValue);
    });

    return StatsValues.ofSuperposition(superpositions);
  }

  public static ofRow(rows: Array<StatsValueRow>): Superposition<StatsValues, StatsValuesError> {
    const superpositions: Array<Superposition<StatsValue, StatsValueError>> = rows.map<Superposition<StatsValue, StatsValueError>>((statsValue: StatsValueRow) => {
      return StatsValue.ofRow(statsValue);
    });

    return StatsValues.ofSuperposition(superpositions);
  }

  public static isJSON(n: unknown): n is Array<StatsValueJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsValue.isJSON(o);
    });
  }

  public static empty(): StatsValues {
    return StatsValues.EMPTY;
  }

  protected constructor(values: Address<StatsValue>) {
    super();
    this.values = values;
  }

  public get(index: void): Quantum<StatsValue> {
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
    }

    return StatsValues.ofArray(newValues);
  }

  public delete(asOf: AsOf): StatsValues {
    const set: Set<StatsValue> = new Set<StatsValue>();

    this.values.forEach((statsValue: StatsValue) => {
      if (!statsValue.getAsOf().equals(asOf)) {
        set.add(statsValue);
      }
    });

    return StatsValues.ofSet(set);
  }

  public contains(value: StatsValue): boolean {
    return this.values.contains(value);
  }

  public size(): number {
    return this.values.size();
  }

  public forEach(iteration: Enumerator<void, StatsValue>): void {
    this.values.forEach(iteration);
  }

  public getAsOfs(): AsOfs {
    const asOfs: Array<AsOf> = [];

    this.values.forEach((value: StatsValue) => {
      asOfs.push(value.getAsOf());
    });

    return AsOfs.ofArray(asOfs);
  }

  public isEmpty(): boolean {
    return this.values.isEmpty();
  }

  public duplicate(): StatsValues {
    if (this.isEmpty()) {
      return StatsValues.empty();
    }

    return StatsValues.of(this.values.duplicate());
  }

  public equals(other: StatsValues): boolean {
    if (this === other) {
      return true;
    }

    return this.values.equals(other.values);
  }

  public toJSON(): Array<StatsValueJSON> {
    const json: Array<StatsValueJSON> = [];

    this.values.forEach((value: StatsValue) => {
      json.push(value.toJSON());
    });

    return json;
  }

  public serialize(): string {
    return this.values.toString();
  }
}
