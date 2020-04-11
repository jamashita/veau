import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Mapper, Predicate } from '../veau-general/Type/Function';
import { Ambiguous } from '../veau-general/Type/Value';
import { Region, RegionJSON, RegionRow } from './Region';

export class Regions implements Collection<number, Region>, JSONable {
  public readonly noun: 'Regions' = 'Regions';
  private readonly regions: Array<Region>;

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

  public [Symbol.iterator](): Iterator<Region> {
    return this.regions[Symbol.iterator]();
  }

  public get(index: number): Optional<Region> {
    const region: Ambiguous<Region> = this.regions[index];

    if (region === undefined) {
      return None.of<Region>();
    }

    return Some.of<Region>(region);
  }

  public contains(value: Region): boolean {
    const found: Ambiguous<Region> = this.regions.find((region: Region) => {
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

  public find(predicate: Predicate<Region>): Ambiguous<Region> {
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
      if (!this.regions[i].equals(other.get(i).get())) {
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
