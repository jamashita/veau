import { StatsOutlineError } from '../Error/StatsOutlineError';
import { StatsOutlinesError } from '../Error/StatsOutlinesError';
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
import { Mapper } from '../General/Type/Function';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from './StatsOutline';

export class StatsOutlines implements Collection<number, StatsOutline>, JSONable, Cloneable {
  public readonly noun: 'StatsOutlines' = 'StatsOutlines';
  private readonly outlines: Sequence<StatsOutline>;

  private static readonly EMPTY: StatsOutlines = new StatsOutlines(ImmutableSequence.empty<StatsOutline>());

  public static of(outlines: Sequence<StatsOutline>): StatsOutlines {
    if (outlines.isEmpty()) {
      return StatsOutlines.empty();
    }

    return new StatsOutlines(outlines);
  }

  public static ofArray(outlines: Array<StatsOutline>): StatsOutlines {
    return StatsOutlines.of(ImmutableSequence.of<StatsOutline>(outlines));
  }

  public static ofSpread(...outlines: Array<StatsOutline>): StatsOutlines {
    return StatsOutlines.ofArray(outlines);
  }

  public static ofSuperposition(superpositions: Array<Superposition<StatsOutline, StatsOutlineError>>): Superposition<StatsOutlines, StatsOutlinesError> {
    return manoeuvre<StatsOutline, StatsOutlineError>(superpositions).match<StatsOutlines, StatsOutlinesError>((outlines: Array<StatsOutline>) => {
      return Success.of<StatsOutlines, StatsOutlinesError>(StatsOutlines.ofArray(outlines));
    }, (err: StatsOutlineError) => {
      return Failure.of<StatsOutlines, StatsOutlinesError>(
        new StatsOutlinesError('StatsOutlines.ofSuperposition()', err)
      );
    });
  }

  public static ofJSON(json: Array<StatsOutlineJSON>): Superposition<StatsOutlines, StatsOutlinesError> {
    const superpositions: Array<Superposition<StatsOutline, StatsOutlineError>> = json.map<Superposition<StatsOutline, StatsOutlineError>>((outline: StatsOutlineJSON) => {
      return StatsOutline.ofJSON(outline);
    });

    return StatsOutlines.ofSuperposition(superpositions);
  }

  public static ofRow(rows: Array<StatsOutlineRow>): Superposition<StatsOutlines, StatsOutlinesError> {
    const superpositions: Array<Superposition<StatsOutline, StatsOutlineError>> = rows.map<Superposition<StatsOutline, StatsOutlineError>>((outline: StatsOutlineRow) => {
      return StatsOutline.ofRow(outline);
    });

    return StatsOutlines.ofSuperposition(superpositions);
  }

  public static empty(): StatsOutlines {
    return StatsOutlines.EMPTY;
  }

  protected constructor(outlines: Sequence<StatsOutline>) {
    this.outlines = outlines;
  }

  public get(index: number): Quantum<StatsOutline> {
    return this.outlines.get(index);
  }

  public contains(value: StatsOutline): boolean {
    return this.outlines.contains(value);
  }

  public size(): number {
    return this.outlines.size();
  }

  public map<U>(mapper: Mapper<StatsOutline, U>): Array<U> {
    return this.outlines.toArray().map<U>(mapper);
  }

  public copy(): StatsOutlines {
    return StatsOutlines.of(this.outlines.copy());
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
    return this.outlines.toArray().map<StatsOutlineJSON>((outline: StatsOutline) => {
      return outline.toJSON();
    });
  }

  public toString(): string {
    return this.outlines.toArray().map<string>((outline: StatsOutline) => {
      return outline.toString();
    }).join(', ');
  }
}
