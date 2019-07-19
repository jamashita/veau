import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';

export class StatsOutlines {
  private outlines: Array<StatsOutline>;

  public static from(outlines: Array<StatsOutline>): StatsOutlines {
    return new StatsOutlines(outlines);
  }

  public static fromJSON(json: Array<StatsOutlineJSON>): StatsOutlines {
    return StatsOutlines.from(json.map<StatsOutline>((outline: StatsOutlineJSON): StatsOutline => {
      return StatsOutline.fromJSON(outline);
    }));
  }

  public static fromRow(rows: Array<StatsOutlineRow>): StatsOutlines {
    return StatsOutlines.from(rows.map<StatsOutline>((outline: StatsOutlineRow) => {
      return StatsOutline.fromRow(outline);
    }));
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

  public length(): number {
    return this.outlines.length;
  }

  public forEach(consumer: (outline: StatsOutline, index: number) => void): void {
    this.outlines.forEach(consumer);
  }

  public map<U>(func: (outline: StatsOutline, index: number) => U): Array<U> {
    return this.outlines.map<U>(func);
  }

  public filter(predicate: (outline: StatsOutline, index: number) => boolean): StatsOutlines {
    return new StatsOutlines(this.outlines.filter(predicate));
  }

  public copy(): StatsOutlines {
    return new StatsOutlines(this.outlines.map<StatsOutline>((outline: StatsOutline) => {
      return outline.copy();
    }));
  }

  public equals(other: StatsOutlines): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.outlines.length;
    if (length !== other.length()) {
      return false;
    }
    for (let i = 0; i < length; i++) {
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
