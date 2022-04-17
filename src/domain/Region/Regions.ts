import { BinaryPredicate, ForEach, JSONable, Kind, Mapping, Nullable } from '@jamashita/anden-type';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableProject, Project } from '@jamashita/lluvia-project';
import { Region, RegionJSON, RegionRow } from './Region.js';
import { RegionID } from './RegionID.js';

export class Regions extends Quantity<RegionID, Region> implements JSONable<Array<RegionJSON>> {
  private readonly regions: ImmutableProject<RegionID, Region>;

  private static readonly EMPTY: Regions = new Regions(ImmutableProject.empty());

  public static empty(): Regions {
    return Regions.EMPTY;
  }

  public static of(regions: Project<RegionID, Region>): Regions {
    if (regions.isEmpty()) {
      return Regions.empty();
    }

    return new Regions(ImmutableProject.of(regions));
  }

  public static ofArray(regions: ReadonlyArray<Region>): Regions {
    const map: Map<RegionID, Region> = new Map();

    regions.forEach((region: Region) => {
      map.set(region.getRegionID(), region);
    });

    return Regions.ofMap(map);
  }

  public static ofJSON(json: ReadonlyArray<RegionJSON>): Regions {
    const arr: Array<Region> = json.map((region: RegionJSON): Region => {
      return Region.ofJSON(region);
    });

    return Regions.ofArray(arr);
  }

  private static ofMap(regions: ReadonlyMap<RegionID, Region>): Regions {
    return Regions.of(ImmutableProject.ofMap(regions));
  }

  public static ofRow(rows: ReadonlyArray<RegionRow>): Regions {
    const arr: Array<Region> = rows.map((region: RegionRow): Region => {
      return Region.ofJSON(region);
    });

    return Regions.ofArray(arr);
  }

  public static ofSpread(...regions: Array<Region>): Regions {
    return Regions.ofArray(regions);
  }

  public static validate(n: unknown): n is ReadonlyArray<RegionJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return Region.validate(o);
    });
  }

  protected constructor(regions: ImmutableProject<RegionID, Region>) {
    super();
    this.regions = regions;
  }

  public contains(value: Region): boolean {
    return this.regions.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Regions)) {
      return false;
    }

    return this.regions.equals(other.regions);
  }

  public every(predicate: BinaryPredicate<Region, RegionID>): boolean {
    return this.regions.every(predicate);
  }

  public filter(predicate: BinaryPredicate<Region, RegionID>): Regions {
    return Regions.of(this.regions.filter(predicate));
  }

  public find(predicate: BinaryPredicate<Region, RegionID>): Nullable<Region> {
    return this.regions.find(predicate);
  }

  public forEach(foreach: ForEach<RegionID, Region>): void {
    this.regions.forEach(foreach);
  }

  public get(key: RegionID): Nullable<Region> {
    return this.regions.get(key);
  }

  public override isEmpty(): boolean {
    return this.regions.isEmpty();
  }

  public iterator(): Iterator<[RegionID, Region]> {
    return this.regions.iterator();
  }

  public map<W>(mapping: Mapping<Region, W>): ImmutableProject<RegionID, W> {
    return this.regions.map(mapping);
  }

  public serialize(): string {
    return this.regions.toString();
  }

  public size(): number {
    return this.regions.size();
  }

  public some(predicate: BinaryPredicate<Region, RegionID>): boolean {
    return this.regions.some(predicate);
  }

  public toJSON(): Array<RegionJSON> {
    const json: Array<RegionJSON> = [];

    this.regions.forEach((region: Region) => {
      json.push(region.toJSON());
    });

    return json;
  }

  public values(): Iterable<Region> {
    return this.regions.values();
  }
}
