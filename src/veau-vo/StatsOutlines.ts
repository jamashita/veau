import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Cloneable } from '../veau-general/Cloneable';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { Mapper } from '../veau-general/Type/Mapper';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from './StatsOutline';

export class StatsOutlines implements Collection<number, StatsOutline>, JSONable, Cloneable {
  private outlines: Array<StatsOutline>;

  public static of(outlines: Array<StatsOutline>): StatsOutlines {
    return new StatsOutlines(outlines);
  }

  public static ofJSON(json: Array<StatsOutlineJSON>): StatsOutlines {
    return StatsOutlines.of(json.map<StatsOutline>((outline: StatsOutlineJSON): StatsOutline => {
      return StatsOutline.ofJSON(outline);
    }));
  }

  public static ofRow(rows: Array<StatsOutlineRow>): StatsOutlines {
    return StatsOutlines.of(rows.map<StatsOutline>((outline: StatsOutlineRow): StatsOutline => {
      return StatsOutline.ofRow(outline);
    }));
  }

  public static empty(): StatsOutlines {
    return StatsOutlines.of([]);
  }

  private constructor(outlines: Array<StatsOutline>) {
    this.outlines = outlines;
  }

  public get(index: number): StatsOutline {
    const outline: StatsOutline | undefined = this.outlines[index];

    if (outline === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return outline;
  }

  public contains(value: StatsOutline): boolean {
    const found: StatsOutline | undefined = this.outlines.find((outline: StatsOutline): boolean => {
      if (value.equals(outline)) {
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
    return this.outlines.length;
  }

  public forEach(iteration: Enumerator<number, StatsOutline>): void {
    this.outlines.forEach(iteration);
  }

  public map<U>(mapper: Mapper<StatsOutline, U>): Array<U> {
    return this.outlines.map<U>(mapper);
  }

  public copy(): StatsOutlines {
    return new StatsOutlines(this.outlines.map<StatsOutline>((outline: StatsOutline): StatsOutline => {
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
      if (!this.outlines[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<StatsOutlineJSON> {
    return this.outlines.map<StatsOutlineJSON>((outline: StatsOutline): StatsOutlineJSON => {
      return outline.toJSON();
    });
  }

  public toString(): string {
    return this.outlines.map<string>((outline: StatsOutline): string => {
      return outline.toString();
    }).join(', ');
  }
}
