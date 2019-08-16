import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Region, RegionJSON, RegionRow } from '../Region';

export class Regions {
  private regions: Array<Region>;

  public static from(regions: Array<Region>): Regions {
    return new Regions(regions);
  }

  public static fromJSON(json: Array<RegionJSON>): Regions {
    const regions: Array<Region> = json.map<Region>((region: RegionJSON): Region => {
      return Region.fromJSON(region);
    });

    return Regions.from(regions);
  }

  public static fromRow(rows: Array<RegionRow>): Regions {
    const regions: Array<Region> = rows.map<Region>((region: RegionRow): Region => {
      return Region.fromRow(region);
    });

    return Regions.from(regions);
  }

  public static default(): Regions {
    return Regions.from([]);
  }

  private constructor(regions: Array<Region>) {
    this.regions = regions;
  }

  public get(index: number): Region {
    const region: Region | undefined = this.regions[index];

    if (region === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return region;
  }

  public length(): number {
    return this.regions.length;
  }

  public map<U>(func: (region: Region) => U): Array<U> {
    return this.regions.map<U>(func);
  }

  public find(predicate: (region: Region) => boolean): Region | undefined {
    return this.regions.find(predicate);
  }

  public equals(other: Regions): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.length();
    if (length !== other.length()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.get(i).equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<RegionJSON> {
    return this.regions.map<RegionJSON>((region: Region): RegionJSON => {
      return region.toJSON();
    });
  }

  public toString(): string {
    return this.regions.map<string>((region: Region): string => {
      return region.toString();
    }).join(', ');
  }
}
