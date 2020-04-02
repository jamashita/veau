import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { Mapper } from '../veau-general/Type/Mapper';
import { Predicate } from '../veau-general/Type/Predicate';
import { Region, RegionJSON, RegionRow } from './Region';

export class Regions implements Collection<number, Region>, JSONable {
  private regions: Array<Region>;

  public static of(regions: Array<Region>): Regions {
    return new Regions(regions);
  }

  public static ofJSON(json: Array<RegionJSON>): Regions {
    const regions: Array<Region> = json.map<Region>((region: RegionJSON) => {
      return Region.ofJSON(region);
    });

    return Regions.of(regions);
  }

  public static ofRow(rows: Array<RegionRow>): Regions {
    const regions: Array<Region> = rows.map<Region>((region: RegionRow) => {
      return Region.ofRow(region);
    });

    return Regions.of(regions);
  }

  public static empty(): Regions {
    return Regions.of([]);
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

  public contains(value: Region): boolean {
    const found: Region | undefined = this.regions.find((region: Region) => {
      return value.equals(region);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.regions.length;
  }

  public map<U>(mapper: Mapper<Region, U>): Array<U> {
    return this.regions.map<U>(mapper);
  }

  public find(predicate: Predicate<Region>): Region | undefined {
    return this.regions.find(predicate);
  }

  public isEmpty(): boolean {
    if (this.regions.length === 0) {
      return true;
    }

    return false;
  }

  public equals(other: Regions): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.regions.length;
    if (length !== other.size()) {
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
    return this.regions.map<RegionJSON>((region: Region) => {
      return region.toJSON();
    });
  }

  public toString(): string {
    return this.regions.map<string>((region: Region) => {
      return region.toString();
    }).join(', ');
  }
}
