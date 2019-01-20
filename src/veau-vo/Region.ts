import { ISO3166 } from './ISO3166';
import { RegionID } from './RegionID';
import { ValueObject } from './ValueObject';

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

export class Region extends ValueObject {
  private regionID: RegionID;
  private name: string;
  private iso3166: ISO3166;

  public static of(regionID: RegionID, name: string, iso3166: ISO3166): Region {
    return new Region(regionID, name, iso3166);
  }

  private constructor(regionID: RegionID, name: string, iso3166: ISO3166) {
    super();
    this.regionID = regionID;
    this.name = name;
    this.iso3166 = iso3166;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getName(): string {
    return this.name;
  }

  public getISO3166(): ISO3166 {
    return this.iso3166;
  }

  public equals(other: Region): boolean {
    if (this === other) {
      return true;
    }
    if (this.regionID.equals(other.getRegionID())) {
      return true;
    }

    return false;
  }

  public toJSON(): RegionJSON {
    const {
      regionID,
      name,
      iso3166
    } = this;

    return {
      regionID: regionID.get(),
      name,
      iso3166: iso3166.get()
    };
  }

  public toString(): string {
    return this.name;
  }
}
