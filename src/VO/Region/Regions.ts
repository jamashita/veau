import { BinaryPredicate, Enumerator, JSONable, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { ImmutableProject, Project, Quantity } from '@jamashita/lluvia-collection';
import { Region, RegionJSON, RegionRow } from './Region';
import { RegionID } from './RegionID';

export class Regions extends Quantity<RegionID, Region, 'Regions'> implements JSONable<Array<RegionJSON>> {
  public readonly noun: 'Regions' = 'Regions';
  private readonly regions: ImmutableProject<RegionID, Region>;

  private static readonly EMPTY: Regions = new Regions(ImmutableProject.empty<RegionID, Region>());

  public static of(regions: Project<RegionID, Region>): Regions {
    if (regions.isEmpty()) {
      return Regions.empty();
    }

    return new Regions(ImmutableProject.of<RegionID, Region>(regions));
  }

  public static ofArray(regions: ReadonlyArray<Region>): Regions {
    const map: Map<RegionID, Region> = new Map<RegionID, Region>();

    regions.forEach((region: Region) => {
      map.set(region.getRegionID(), region);
    });

    return Regions.ofMap(map);
  }

  public static ofSpread(...regions: Array<Region>): Regions {
    return Regions.ofArray(regions);
  }

  public static ofJSON(json: ReadonlyArray<RegionJSON>): Regions {
    const arr: Array<Region> = json.map<Region>((region: RegionJSON) => {
      return Region.ofJSON(region);
    });

    return Regions.ofArray(arr);
  }

  public static ofRow(rows: ReadonlyArray<RegionRow>): Regions {
    const arr: Array<Region> = rows.map<Region>((region: RegionRow) => {
      return Region.ofJSON(region);
    });

    return Regions.ofArray(arr);
  }

  public static empty(): Regions {
    return Regions.EMPTY;
  }

  public static validate(n: unknown): n is ReadonlyArray<RegionJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return Region.validate(o);
    });
  }

  private static ofMap(regions: ReadonlyMap<RegionID, Region>): Regions {
    return Regions.of(ImmutableProject.ofMap<RegionID, Region>(regions));
  }

  protected constructor(regions: ImmutableProject<RegionID, Region>) {
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

  public forEach(enumerator: Enumerator<RegionID, Region>): void {
    this.regions.forEach(enumerator);
  }

  public isEmpty(): boolean {
    return this.regions.isEmpty();
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

  public iterator(): Iterator<[RegionID, Region]> {
    return this.regions.iterator();
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

  public filter(predicate: BinaryPredicate<Region, RegionID>): Regions {
    return Regions.of(this.regions.filter(predicate));
  }

  public find(predicate: BinaryPredicate<Region, RegionID>): Nullable<Region> {
    return this.regions.find(predicate);
  }

  public map<W>(mapper: Mapper<Region, W>): ImmutableProject<RegionID, W> {
    return this.regions.map<W>(mapper);
  }
}
