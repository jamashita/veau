import { ISO3166 } from '../veau-vo/ISO3166';
import { RegionID } from '../veau-vo/RegionID';
import { RegionName } from '../veau-vo/RegionName';
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
  private name: RegionName;
  private iso3166: ISO3166;

  public static from(regionID: RegionID, name: RegionName, iso3166: ISO3166): Region {
    return new Region(regionID, name, iso3166);
  }

  public static fromJSON(json: RegionJSON): Region {
    const {
      regionID,
      name,
      iso3166
    } = json;

    return Region.from(RegionID.of(regionID), RegionName.of(name), ISO3166.of(iso3166));
  }

  public static fromRow(row: RegionRow): Region {
    const {
      regionID,
      name,
      iso3166
    } = row;

    return Region.from(RegionID.of(regionID), RegionName.of(name), ISO3166.of(iso3166));
  }

  public static default(): Region {
    return Region.from(RegionID.of(0), RegionName.default(), ISO3166.default());
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
