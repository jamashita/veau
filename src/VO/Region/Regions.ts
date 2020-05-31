import { Collection, ImmutableProject, Project } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { Absent, Alive, Dead, Present, Quantum, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { Objet } from '@jamashita/publikum-object';
import { Mapper, Predicate } from '@jamashita/publikum-type';

import { RegionError } from './Error/RegionError';
import { RegionsError } from './Error/RegionsError';
import { Region, RegionJSON, RegionRow } from './Region';
import { RegionID } from './RegionID';

export class Regions extends Objet implements Collection<RegionID, Region>, JSONable {
  public readonly noun: 'Regions' = 'Regions';
  private readonly regions: Project<RegionID, Region>;

  private static readonly EMPTY: Regions = new Regions(ImmutableProject.empty<RegionID, Region>());

  public static of(regions: Project<RegionID, Region>): Regions {
    if (regions.isEmpty()) {
      return Regions.empty();
    }

    return new Regions(regions);
  }

  private static ofMap(regions: Map<RegionID, Region>): Regions {
    return Regions.of(ImmutableProject.of<RegionID, Region>(regions));
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

  protected constructor(regions: Project<RegionID, Region>) {
    super();
    this.regions = regions;
  }

  public get(key: RegionID): Quantum<Region> {
    return this.regions.get(key);
  }

  public contains(value: Region): boolean {
    return this.regions.contains(value);
  }

  public size(): number {
    return this.regions.size();
  }

  public map<U>(mapper: Mapper<Region, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.regions.forEach((region: Region) => {
      array.push(mapper(region, i));
      i++;
    });

    return array;
  }

  public find(predicate: Predicate<Region>): Quantum<Region> {
    for (const region of this.regions.toMap().values()) {
      if (predicate(region)) {
        return Present.of<Region>(region);
      }
    }

    return Absent.of<Region>();
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
}
