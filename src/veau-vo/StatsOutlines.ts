import { StatsOutlineError } from '../veau-error/StatsOutlineError';
import { StatsOutlinesError } from '../veau-error/StatsOutlinesError';
import { Cloneable } from '../veau-general/Cloneable';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Mapper } from '../veau-general/Type/Function';
import { Ambiguous } from '../veau-general/Type/Value';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from './StatsOutline';

export class StatsOutlines implements Collection<number, StatsOutline>, JSONable, Cloneable {
  public readonly noun: 'StatsOutlines' = 'StatsOutlines';
  private readonly outlines: Array<StatsOutline>;

  public static of(outlines: Array<StatsOutline>): StatsOutlines {
    return new StatsOutlines(outlines);
  }

  public static ofTry(tries: Array<Try<StatsOutline, StatsOutlineError>>): Try<StatsOutlines, StatsOutlinesError> {
    const failures: Array<Failure<StatsOutline, StatsOutlineError>> = tries.filter((trial: Try<StatsOutline, StatsOutlineError>): trial is Failure<StatsOutline, StatsOutlineError> => {
      return trial.isFailure();
    });

    if (failures.length !== 0) {
      const message: string = failures.map<string>((failure: Failure<StatsOutline, StatsOutlineError>) => {
        return failure.getMessage();
      }).join(': ');

      return Failure.of<StatsOutlines, StatsOutlinesError>(new StatsOutlinesError(message));
    }

    const outlines: Array<StatsOutline> = tries.map<StatsOutline>((trial: Try<StatsOutline, StatsOutlineError>) => {
      return trial.get();
    });

    return Success.of<StatsOutlines, StatsOutlinesError>(StatsOutlines.of(outlines));
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
    return StatsOutlines.of([]);
  }

  private constructor(outlines: Array<StatsOutline>) {
    this.outlines = outlines;
  }

  public get(index: number): Optional<StatsOutline> {
    const outline: Ambiguous<StatsOutline> = this.outlines[index];

    if (outline === undefined) {
      return None.of<StatsOutline>();
    }

    return Some.of<StatsOutline>(outline);
  }

  public contains(value: StatsOutline): boolean {
    const found: Ambiguous<StatsOutline> = this.outlines.find((outline: StatsOutline) => {
      return value.equals(outline);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.outlines.length;
  }

  public map<U>(mapper: Mapper<StatsOutline, U>): Array<U> {
    return this.outlines.map<U>(mapper);
  }

  public copy(): StatsOutlines {
    return new StatsOutlines(this.outlines.map<StatsOutline>((outline: StatsOutline) => {
      return outline.copy();
    }));
  }

  public isEmpty(): boolean {
    if (this.outlines.length === 0) {
      return true;
    }

    return false;
  }

  public equals(other: StatsOutlines): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.outlines.length;
    if (length !== other.size()) {
      return false;
    }

    for (let i: number = 0; i < length; i++) {
      if (!this.outlines[i].equals(other.get(i).get())) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<StatsOutlineJSON> {
    return this.outlines.map<StatsOutlineJSON>((outline: StatsOutline) => {
      return outline.toJSON();
    });
  }

  public toString(): string {
    return this.outlines.map<string>((outline: StatsOutline) => {
      return outline.toString();
    }).join(', ');
  }
}
