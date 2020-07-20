import { CancellableEnumerator, ImmutableProject, Pair, Project, Quantity } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { BinaryPredicate, Mapper, Nullable, Predicate } from '@jamashita/publikum-type';

import { RegionError } from './Error/RegionError';
import { RegionsError } from './Error/RegionsError';
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

  public static ofSuperposition(
    superpositions: Array<Superposition<Region, RegionError>>
  ): Superposition<Regions, RegionsError> {
    return Superposition.all<Region, RegionError>(superpositions, RegionError).transform<Regions, RegionsError>(
      (regions: Array<Region>) => {
        return Regions.ofArray(regions);
      },
      (err: RegionError) => {
        throw new RegionsError('Regions.ofSuperposition()', err);
      },
      RegionsError
    );
  }

  public static ofJSON(json: Array<RegionJSON>): Superposition<Regions, RegionsError> {
    const superpositions: Array<Superposition<Region, RegionError>> = json.map<Superposition<Region, RegionError>>(
      (region: RegionJSON) => {
        return Region.ofJSON(region);
      }
    );

    return Regions.ofSuperposition(superpositions);
  }

  public static ofRow(rows: Array<RegionRow>): Superposition<Regions, RegionsError> {
    const superpositions: Array<Superposition<Region, RegionError>> = rows.map<Superposition<Region, RegionError>>(
      (region: RegionRow) => {
        return Region.ofRow(region);
      }
    );

    return Regions.ofSuperposition(superpositions);
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
    for (const region of this.regions.toMap().values()) {
      if (predicate(region)) {
        return region;
      }
    }

    return null;
  }
}
