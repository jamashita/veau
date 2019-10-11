import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { JSONable } from '../../veau-general/JSONable';
import { Serializable } from '../../veau-general/Serializable';
import { Mapper } from '../../veau-general/Type/Mapper';
import { Predicate } from '../../veau-general/Type/Predicate';
import { Region, RegionJSON, RegionRow } from '../Region';

export class Regions implements JSONable, Serializable {
  private regions: Array<Region>;

  public static from(regions: Array<Region>): Regions {
    return new Regions(regions);
  }

  public static fromJSON(json: Array<RegionJSON>): Regions {
    const regions: Array<Region> = json.map<Region>((region: RegionJSON): Region => {
      return Region.ofJSON(region);
    });

    return Regions.from(regions);
  }

  public static fromRow(rows: Array<RegionRow>): Regions {
    const regions: Array<Region> = rows.map<Region>((region: RegionRow): Region => {
      return Region.ofRow(region);
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

  public map<U>(mapper: Mapper<Region, U>): Array<U> {
    return this.regions.map<U>(mapper);
  }

  public find(predicate: Predicate<Region>): Region | undefined {
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
