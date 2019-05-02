import { ISO3166 } from '../veau-vo/ISO3166';
import { RegionID } from '../veau-vo/RegionID';
import { Entity } from './Entity';

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

export class Region extends Entity<RegionID> {
  private regionID: RegionID;
  private name: string;
  private iso3166: ISO3166;

  public static default(): Region {
    return new Region(RegionID.of(0), '', ISO3166.default());
  }

  public constructor(regionID: RegionID, name: string, iso3166: ISO3166) {
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

  public getIdentifier(): RegionID {
    return this.regionID;
  }

  public copy(): Region {
    const {
      regionID,
      name,
      iso3166
    } = this;

    return new Region(regionID, name, iso3166);
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
    const {
      regionID,
      name,
      iso3166
    } = this;

    return `${regionID.toString()} ${name} ${iso3166.toString()}`;
  }
}
