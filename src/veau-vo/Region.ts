import { JSONable } from '../veau-general/JSONable';
import { ValueObject } from '../veau-general/ValueObject';
import { ISO3166 } from './ISO3166';
import { RegionID } from './RegionID';
import { RegionName } from './RegionName';

export type RegionJSON = {
  regionID: number;
  name: string;
  iso3166: string;
};

export type RegionRow = {
  regionID: number;
  name: string;
  iso3166: string;
};

export class Region extends ValueObject implements JSONable {
  private regionID: RegionID;
  private name: RegionName;
  private iso3166: ISO3166;

  public static of(regionID: RegionID, name: RegionName, iso3166: ISO3166): Region {
    return new Region(regionID, name, iso3166);
  }

  public static ofJSON(json: RegionJSON): Region {
    const {
      regionID,
      name,
      iso3166
    } = json;

    return Region.of(RegionID.of(regionID), RegionName.of(name), ISO3166.of(iso3166));
  }

  public static ofRow(row: RegionRow): Region {
    const {
      regionID,
      name,
      iso3166
    } = row;

    return Region.of(RegionID.of(regionID), RegionName.of(name), ISO3166.of(iso3166));
  }

  public static default(): Region {
    return Region.of(RegionID.of(0), RegionName.default(), ISO3166.default());
  }

  private constructor(regionID: RegionID, name: RegionName, iso3166: ISO3166) {
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

  public equals(other: Region): boolean {
    if (this === other) {
      return true;
    }

    const {
      regionID,
      name,
      iso3166
    } = this;

    if (!regionID.equals(other.getRegionID())) {
      return false;
    }
    if (!name.equals(other.getName())) {
      return false;
    }
    if (!iso3166.equals(other.getISO3166())) {
      return false;
    }

    return true;
  }

  public toJSON(): RegionJSON {
    const {
      regionID,
      name,
      iso3166
    } = this;

    return {
      regionID: regionID.get(),
      name: name.get(),
      iso3166: iso3166.get()
    };
  }

  public toString(): string {
    const {
      regionID,
      name,
      iso3166
    } = this;

    return `${regionID.toString()} ${name.toString()} ${iso3166.toString()}`;
  }
}
