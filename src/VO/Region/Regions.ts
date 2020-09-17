import { CancellableEnumerator, ImmutableProject, Pair, Project, Quantity } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper, Nullable, Predicate } from '@jamashita/publikum-type';
import { Region, RegionJSON, RegionRow } from './Region';
import { RegionID } from './RegionID';

export class Regions extends Quantity<Regions, RegionID, Region, 'Regions'> implements JSONable<Array<RegionJSON>> {
  public readonly noun: 'Regions' = 'Regions';
  private readonly regions: Project<RegionID, Region>;

  private static readonly EMPTY: Regions = new Regions(ImmutableProject.empty<RegionID, Region>());

  public static of(regions: Project<RegionID, Region>): Regions {
    if (regions.isEmpty()) {
      return Regions.empty();
    }

    return new Regions(regions);
  }

  public static ofArray(regions: Array<Region>): Regions {
    const map: Map<RegionID, Region> = new Map<RegionID, Region>();

    regions.forEach((region: Region) => {
      map.set(region.getRegionID(), region);
    });

    return Regions.ofMap(map);
  }

  public static ofSpread(...regions: Array<Region>): Regions {
    return Regions.ofArray(regions);
  }

  public static ofJSON(json: Array<RegionJSON>): Regions {
    const arr: Array<Region> = json.map<Region>((region: RegionJSON) => {
      return Region.ofJSON(region);
    });

    return Regions.ofArray(arr);
  }

  public static ofRow(rows: Array<RegionRow>): Regions {
    const arr: Array<Region> = rows.map<Region>((region: RegionRow) => {
      return Region.ofJSON(region);
    });

    return Regions.ofArray(arr);
  }

  public static empty(): Regions {
    return Regions.EMPTY;
  }

  private static ofMap(regions: Map<RegionID, Region>): Regions {
    return Regions.of(ImmutableProject.of<RegionID, Region>(regions));
  }

  protected constructor(regions: Project<RegionID, Region>) {
    super();
    this.regions = regions;
  }

  public get(key: RegionID): Nullable<Region> {
    return this.regions.get(key);
  }

  public contains(value: Region): boolean {
    return this.regions.contains(value);
  }

  public size(): number {
    return this.regions.size();
  }

  public forEach(iteration: CancellableEnumerator<RegionID, Region>): void {
    this.regions.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.regions.isEmpty();
  }

  public equals(other: Regions): boolean {
    if (this === other) {
      return true;
    }

    return this.regions.equals(other.regions);
  }

  public toJSON(): Array<RegionJSON> {
    const json: Array<RegionJSON> = [];

    this.regions.forEach((region: Region) => {
      json.push(region.toJSON());
    });

    return json;
  }

  public serialize(): string {
    return this.regions.toString();
  }

  public [Symbol.iterator](): Iterator<Pair<RegionID, Region>> {
    return this.regions[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<Region, RegionID>): boolean {
    return this.regions.every(predicate);
  }

  public some(predicate: BinaryPredicate<Region, RegionID>): boolean {
    return this.regions.some(predicate);
  }

  public values(): Iterable<Region> {
    return this.regions.values();
  }

  public map<U>(mapper: Mapper<Region, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.forEach((region: Region) => {
      array.push(mapper(region, i));
      i++;
    });

    return array;
  }

  public find(predicate: Predicate<Region>): Nullable<Region> {
    for (const region of this.regions.values()) {
      if (predicate(region)) {
        return region;
      }
    }

    return null;
  }
}
