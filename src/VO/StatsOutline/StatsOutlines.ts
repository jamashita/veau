import {
    CancellableEnumerator, ImmutableProject, Pair, Project, Quantity
} from '@jamashita/publikum-collection';
import { Cloneable, JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { Mapper, Nullable } from '@jamashita/publikum-type';

import { StatsOutlineError } from './Error/StatsOutlineError';
import { StatsOutlinesError } from './Error/StatsOutlinesError';
import { StatsID } from './StatsID';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from './StatsOutline';

// TODO TEST UNDONE
export class StatsOutlines extends Quantity<StatsOutlines, StatsID, StatsOutline, 'StatsOutlines'>
  implements Cloneable<StatsOutlines>, JSONable<Array<StatsOutlineJSON>> {
  public readonly noun: 'StatsOutlines' = 'StatsOutlines';
  private readonly outlines: Project<StatsID, StatsOutline>;

  private static readonly EMPTY: StatsOutlines = new StatsOutlines(ImmutableProject.empty<StatsID, StatsOutline>());

  public static of(outlines: Project<StatsID, StatsOutline>): StatsOutlines {
    if (outlines.isEmpty()) {
      return StatsOutlines.empty();
    }

    return new StatsOutlines(outlines);
  }

  private static ofMap(outlines: Map<StatsID, StatsOutline>): StatsOutlines {
    return StatsOutlines.of(ImmutableProject.of<StatsID, StatsOutline>(outlines));
  }

  public static ofArray(outlines: Array<StatsOutline>): StatsOutlines {
    const map: Map<StatsID, StatsOutline> = new Map<StatsID, StatsOutline>();

    outlines.forEach((outline: StatsOutline) => {
      map.set(outline.getStatsID(), outline);
    });

    return StatsOutlines.ofMap(map);
  }

  public static ofSpread(...outlines: Array<StatsOutline>): StatsOutlines {
    return StatsOutlines.ofArray(outlines);
  }

  public static ofSuperposition(
    superpositions: Array<Superposition<StatsOutline, StatsOutlineError>>
  ): Superposition<StatsOutlines, StatsOutlinesError> {
    return Superposition.all<StatsOutline, StatsOutlineError>(superpositions, StatsOutlineError).transform<
      StatsOutlines,
      StatsOutlinesError
    >(
      (outlines: Array<StatsOutline>) => {
        return StatsOutlines.ofArray(outlines);
      },
      (err: StatsOutlineError) => {
        throw new StatsOutlinesError('StatsOutlines.ofSuperposition()', err);
      },
      StatsOutlinesError
    );
  }

  public static ofJSON(json: Array<StatsOutlineJSON>): Superposition<StatsOutlines, StatsOutlinesError> {
    const superpositions: Array<Superposition<StatsOutline, StatsOutlineError>> = json.map<
      Superposition<StatsOutline, StatsOutlineError>
    >((outline: StatsOutlineJSON) => {
      return StatsOutline.ofJSON(outline);
    });

    return StatsOutlines.ofSuperposition(superpositions);
  }

  public static ofRow(rows: Array<StatsOutlineRow>): Superposition<StatsOutlines, StatsOutlinesError> {
    const superpositions: Array<Superposition<StatsOutline, StatsOutlineError>> = rows.map<
      Superposition<StatsOutline, StatsOutlineError>
    >((outline: StatsOutlineRow) => {
      return StatsOutline.ofRow(outline);
    });

    return StatsOutlines.ofSuperposition(superpositions);
  }

  public static empty(): StatsOutlines {
    return StatsOutlines.EMPTY;
  }

  protected constructor(outlines: Project<StatsID, StatsOutline>) {
    super();
    this.outlines = outlines;
  }

  public get(key: StatsID): Nullable<StatsOutline> {
    return this.outlines.get(key);
  }

  public contains(value: StatsOutline): boolean {
    return this.outlines.contains(value);
  }

  public size(): number {
    return this.outlines.size();
  }

  public forEach(iteration: CancellableEnumerator<StatsID, StatsOutline>): void {
    this.outlines.forEach(iteration);
  }

  public map<U>(mapper: Mapper<StatsOutline, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.forEach((outline: StatsOutline) => {
      array.push(mapper(outline, i));
      i++;
    });

    return array;
  }

  public iterator(): Iterator<Pair<StatsID, StatsOutline>> {
    return this.outlines.iterator();
  }

  public duplicate(): StatsOutlines {
    if (this.isEmpty()) {
      return StatsOutlines.empty();
    }

    return StatsOutlines.of(this.outlines.duplicate());
  }

  public isEmpty(): boolean {
    return this.outlines.isEmpty();
  }

  public equals(other: StatsOutlines): boolean {
    if (this === other) {
      return true;
    }

    return this.outlines.equals(other.outlines);
  }

  public toJSON(): Array<StatsOutlineJSON> {
    const json: Array<StatsOutlineJSON> = [];

    this.outlines.forEach((outline: StatsOutline) => {
      json.push(outline.toJSON());
    });

    return json;
  }

  public serialize(): string {
    return this.outlines.toString();
  }
}
