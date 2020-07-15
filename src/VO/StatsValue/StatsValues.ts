import {
    CancellableEnumerator, ImmutableProject, Pair, Project, Quantity
} from '@jamashita/publikum-collection';
import { Cloneable, JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { Kind, Nullable } from '@jamashita/publikum-type';

import { AsOf } from '../AsOf/AsOf';
import { AsOfs } from '../AsOf/AsOfs';
import { StatsValueError } from './Error/StatsValueError';
import { StatsValuesError } from './Error/StatsValuesError';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues extends Quantity<StatsValues, AsOf, StatsValue, 'StatsValues'>
  implements Cloneable<StatsValues>, JSONable<Array<StatsValueJSON>> {
  public readonly noun: 'StatsValues' = 'StatsValues';
  private readonly values: Project<AsOf, StatsValue>;

  private static readonly EMPTY: StatsValues = new StatsValues(ImmutableProject.empty<AsOf, StatsValue>());

  public static of(values: Project<AsOf, StatsValue>): StatsValues {
    if (values.isEmpty()) {
      return StatsValues.empty();
    }

    return new StatsValues(values);
  }

  protected static ofMap(values: Map<AsOf, StatsValue>): StatsValues {
    return StatsValues.of(ImmutableProject.of<AsOf, StatsValue>(values));
  }

  public static ofArray(values: Array<StatsValue>): StatsValues {
    const map: Map<AsOf, StatsValue> = new Map<AsOf, StatsValue>();

    values.forEach((value: StatsValue) => {
      map.set(value.getAsOf(), value);
    });

    return StatsValues.ofMap(map);
  }

  public static ofSpread(...values: Array<StatsValue>): StatsValues {
    return StatsValues.ofArray(values);
  }

  public static ofSuperposition(
    superpositions: Array<Superposition<StatsValue, StatsValueError>>
  ): Superposition<StatsValues, StatsValuesError> {
    return Superposition.all<StatsValue, StatsValueError>(superpositions, StatsValueError).transform<
      StatsValues,
      StatsValuesError
    >(
      (values: Array<StatsValue>) => {
        return StatsValues.ofArray(values);
      },
      (err: StatsValueError) => {
        throw new StatsValuesError('StatsValues.ofSuperposition()', err);
      },
      StatsValuesError
    );
  }

  public static ofJSON(json: Array<StatsValueJSON>): Superposition<StatsValues, StatsValuesError> {
    const superpositions: Array<Superposition<StatsValue, StatsValueError>> = json.map<
      Superposition<StatsValue, StatsValueError>
    >((statsValue: StatsValueJSON) => {
      return StatsValue.ofJSON(statsValue);
    });

    return StatsValues.ofSuperposition(superpositions);
  }

  public static ofRow(rows: Array<StatsValueRow>): Superposition<StatsValues, StatsValuesError> {
    const superpositions: Array<Superposition<StatsValue, StatsValueError>> = rows.map<
      Superposition<StatsValue, StatsValueError>
    >((statsValue: StatsValueRow) => {
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

  protected constructor(values: Project<AsOf, StatsValue>) {
    super();
    this.values = values;
  }

  public get(key: AsOf): Nullable<StatsValue> {
    return this.values.get(key);
  }

  public set(statsValue: StatsValue): StatsValues {
    return StatsValues.of(this.values.set(statsValue.getAsOf(), statsValue));
  }

  public delete(asOf: AsOf): StatsValues {
    return StatsValues.of(this.values.remove(asOf));
  }

  public contains(value: StatsValue): boolean {
    return this.values.contains(value);
  }

  public size(): number {
    return this.values.size();
  }

  public forEach(iteration: CancellableEnumerator<AsOf, StatsValue>): void {
    this.values.forEach(iteration);
  }

  public iterator(): Iterator<Pair<AsOf, StatsValue>> {
    return this.values.iterator();
  }

  public getAsOfs(): AsOfs {
    return AsOfs.ofArray([...this.values.toMap().keys()]);
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
    const strs: Array<string> = [];

    this.values.forEach((value: StatsValue) => {
      strs.push(value.toString());
    });

    return strs.join(', ');
  }
}
