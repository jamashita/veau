import {
  Alive,
  Collection,
  Dead,
  ImmutableSequence,
  JSONable,
  Mapper,
  Objet,
  Predicate,
  Quantum,
  Schrodinger,
  Sequence,
  Superposition
} from 'publikum';

import { RegionError } from './Error/RegionError';
import { RegionsError } from './Error/RegionsError';
import { Region, RegionJSON, RegionRow } from './Region';

export class Regions extends Objet implements Collection<number, Region>, JSONable {
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

  public static ofSuperposition(
    superpositions: Array<Superposition<Region, RegionError>>
  ): Superposition<Regions, RegionsError> {
    return Schrodinger.all<Region, RegionError>(superpositions).match<Regions, RegionsError>(
      (regions: Array<Region>) => {
        return Alive.of<Regions, RegionsError>(Regions.ofArray(regions));
      },
      (err: RegionError) => {
        return Dead.of<Regions, RegionsError>(new RegionsError('Regions.ofSuperposition()', err));
      }
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

  protected constructor(regions: Sequence<Region>) {
    super();
    this.regions = regions;
  }

  public get(index: number): Quantum<Region> {
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

  public find(predicate: Predicate<Region>): Quantum<Region> {
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

  public serialize(): string {
    return this.regions.toString();
  }
}
