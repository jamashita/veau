import { StatsOutlineError } from '../Error/StatsOutlineError';
import { StatsOutlinesError } from '../Error/StatsOutlinesError';
import { Cloneable } from '../General/Interface/Cloneable';
import { Collection } from '../General/Interface/Collection';
import { Sequence } from '../General/Collection/Sequence';
import { JSONable } from '../General/Interface/JSONable';
import { Optional } from '../General/Optional/Optional';
import { Failure } from '../General/Try/Failure';
import { manoeuvre } from '../General/Try/Manoeuvre';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { Mapper } from '../General/Type/Function';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from './StatsOutline';

export class StatsOutlines implements Collection<number, StatsOutline>, JSONable, Cloneable {
  public readonly noun: 'StatsOutlines' = 'StatsOutlines';
  private readonly outlines: Sequence<StatsOutline>;

  private static readonly EMPTY: StatsOutlines = new StatsOutlines(Sequence.empty<StatsOutline>());

  public static of(outlines: Sequence<StatsOutline>): StatsOutlines {
    if (outlines.isEmpty()) {
      return StatsOutlines.empty();
    }

    return new StatsOutlines(outlines);
  }

  public static ofArray(outlines: Array<StatsOutline>): StatsOutlines {
    return StatsOutlines.of(Sequence.of<StatsOutline>(outlines));
  }

  public static ofSpread(...outlines: Array<StatsOutline>): StatsOutlines {
    return StatsOutlines.ofArray(outlines);
  }

  public static ofTry(tries: Array<Try<StatsOutline, StatsOutlineError>>): Try<StatsOutlines, StatsOutlinesError> {
    return manoeuvre<StatsOutline, StatsOutlineError>(tries).match<Try<StatsOutlines, StatsOutlinesError>>((outlines: Array<StatsOutline>) => {
      return Success.of<StatsOutlines, StatsOutlinesError>(StatsOutlines.ofArray(outlines));
    }, (err: StatsOutlineError) => {
      return Failure.of<StatsOutlines, StatsOutlinesError>(new StatsOutlinesError(err.message));
    });
  }

  public static ofJSON(json: Array<StatsOutlineJSON>): Try<StatsOutlines, StatsOutlinesError> {
    const trials: Array<Try<StatsOutline, StatsOutlineError>> = json.map<Try<StatsOutline, StatsOutlineError>>((outline: StatsOutlineJSON) => {
      return StatsOutline.ofJSON(outline);
    });

    return StatsOutlines.ofTry(trials);
  }

  public static ofRow(rows: Array<StatsOutlineRow>): Try<StatsOutlines, StatsOutlinesError> {
    const trials: Array<Try<StatsOutline, StatsOutlineError>> = rows.map<Try<StatsOutline, StatsOutlineError>>((outline: StatsOutlineRow) => {
      return StatsOutline.ofRow(outline);
    });

    return StatsOutlines.ofTry(trials);
  }

  public static empty(): StatsOutlines {
    return StatsOutlines.EMPTY;
  }

  protected constructor(outlines: Sequence<StatsOutline>) {
    this.outlines = outlines;
  }

  public get(index: number): Optional<StatsOutline> {
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
