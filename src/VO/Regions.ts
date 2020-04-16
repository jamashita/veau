import { ImmutableSequence } from '../General/Collection/Sequence/ImmutableSequence';
import { Sequence } from '../General/Collection/Sequence/Interface/Sequence';
import { Collection } from '../General/Interface/Collection';
import { JSONable } from '../General/Interface/JSONable';
import { Optional } from '../General/Quantum/Optional';
import { Mapper, Predicate } from '../General/Type/Function';
import { Region, RegionJSON, RegionRow } from './Region';

export class Regions implements Collection<number, Region>, JSONable {
  public readonly noun: 'Regions' = 'Regions';
  private readonly regions: Sequence<Region>;

  private static readonly EMPTY: Regions = new Regions(ImmutableSequence.empty<Region>());

  public static of(regions: Sequence<Region>): Regions {
    if (regions.isEmpty()) {
      return Regions.empty();
    }

    return new Regions(regions);
  }

  public static ofArray(regions: Array<Region>): Regions {
    return Regions.of(ImmutableSequence.of<Region>(regions));
  }

  public static ofSpread(...regions: Array<Region>): Regions {
    return Regions.ofArray(regions);
  }

  public static ofJSON(json: Array<RegionJSON>): Regions {
    const regions: Array<Region> = json.map<Region>((region: RegionJSON) => {
      return Region.ofJSON(region);
    });

    return Regions.ofArray(regions);
  }

  public static ofRow(rows: Array<RegionRow>): Regions {
    const regions: Array<Region> = rows.map<Region>((region: RegionRow) => {
      return Region.ofRow(region);
    });

    return Regions.ofArray(regions);
  }

  public static empty(): Regions {
    return Regions.EMPTY;
  }

  protected constructor(regions: Sequence<Region>) {
    this.regions = regions;
  }

  public get(index: number): Optional<Region> {
    return this.regions.get(index);
  }

  public contains(value: Region): boolean {
    return this.regions.contains(value);
  }

  public size(): number {
    return this.regions.size();
  }

  public map<U>(mapper: Mapper<Region, U>): Array<U> {
    return this.regions.toArray().map<U>(mapper);
  }

  public find(predicate: Predicate<Region>): Optional<Region> {
    return this.regions.find(predicate);
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
    return this.regions.toArray().map<RegionJSON>((region: Region) => {
      return region.toJSON();
    });
  }

  public toString(): string {
    return this.regions.toArray().map<string>((region: Region) => {
      return region.toString();
    }).join(', ');
  }
}
