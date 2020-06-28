import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { RegionError } from './Error/RegionError';
import { RegionIDError } from './Error/RegionIDError';
import { ISO3166 } from './ISO3166';
import { RegionID } from './RegionID';
import { RegionName } from './RegionName';

export type RegionJSON = Readonly<{
  regionID: string;
  name: string;
  iso3166: string;
}>;
export type RegionRow = Readonly<{
  regionID: string;
  name: string;
  iso3166: string;
}>;

export class Region extends ValueObject<Region, 'Region'> implements JSONable<RegionJSON> {
  public readonly noun: 'Region' = 'Region';
  private readonly regionID: RegionID;
  private readonly name: RegionName;
  private readonly iso3166: ISO3166;

  private static readonly EMPTY: Region = new Region(RegionID.empty(), RegionName.empty(), ISO3166.empty());

  public static of(regionID: RegionID, name: RegionName, iso3166: ISO3166): Region {
    if (regionID.isEmpty()) {
      return Region.empty();
    }
    if (name.isEmpty()) {
      return Region.empty();
    }
    if (iso3166.isEmpty()) {
      return Region.empty();
    }

    return new Region(regionID, name, iso3166);
  }

  public static ofJSON(json: RegionJSON): Superposition<Region, RegionError> {
    return RegionID.ofString(json.regionID).transform<Region, RegionError>(
      (regionID: RegionID) => {
        return Region.of(regionID, RegionName.of(json.name), ISO3166.of(json.iso3166));
      },
      (err: RegionIDError) => {
        throw new RegionError('Region.ofJSON()', err);
      }
    );
  }

  public static ofRow(row: RegionRow): Superposition<Region, RegionError> {
    return RegionID.ofString(row.regionID).transform<Region, RegionError>(
      (regionID: RegionID) => {
        return Region.of(regionID, RegionName.of(row.name), ISO3166.of(row.iso3166));
      },
      (err: RegionIDError) => {
        throw new RegionError('Region.ofRow()', err);
      }
    );
  }

  public static empty(): Region {
    return Region.EMPTY;
  }

  public static isJSON(n: unknown): n is RegionJSON {
    if (!Kind.isPlainObject(n)) {
      return false;
    }
    if (!Kind.isString(n.regionID)) {
      return false;
    }
    if (!Kind.isString(n.name)) {
      return false;
    }
    if (!Kind.isString(n.iso3166)) {
      return false;
    }

    return true;
  }

  protected constructor(regionID: RegionID, name: RegionName, iso3166: ISO3166) {
    super();
    this.regionID = regionID;
    this.name = name;
    this.iso3166 = iso3166;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getName(): RegionName {
    return this.name;
  }

  public getISO3166(): ISO3166 {
    return this.iso3166;
  }

  public isEmpty(): boolean {
    if (this === Region.empty()) {
      return true;
    }

    return false;
  }

  public equals(other: Region): boolean {
    if (this === other) {
      return true;
    }
    if (!this.regionID.equals(other.regionID)) {
      return false;
    }
    if (!this.name.equals(other.name)) {
      return false;
    }
    if (!this.iso3166.equals(other.iso3166)) {
      return false;
    }

    return true;
  }

  public toJSON(): RegionJSON {
    return {
      regionID: this.regionID.get().get(),
      name: this.name.get(),
      iso3166: this.iso3166.get()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.regionID.toString());
    properties.push(this.name.toString());
    properties.push(this.iso3166.toString());

    return properties.join(' ');
  }
}
