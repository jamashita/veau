import { JSONable } from '../veau-general/JSONable';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';
import { ISO3166 } from './ISO3166';
import { RegionID } from './RegionID';
import { RegionName } from './RegionName';

export type RegionJSON = Readonly<{
  regionID: number;
  name: string;
  iso3166: string;
}>;

export type RegionRow = Readonly<{
  regionID: number;
  name: string;
  iso3166: string;
}>;

export class Region extends ValueObject implements JSONable {
  public readonly noun: 'Region' = 'Region';
  private readonly regionID: RegionID;
  private readonly name: RegionName;
  private readonly iso3166: ISO3166;

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

  public static isJSON(n: unknown): n is RegionJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }

    const {
      regionID,
      name,
      iso3166
    } = n;

    if (!Type.isInteger(regionID)) {
      return false;
    }
    if (!Type.isString(name)) {
      return false;
    }
    if (!Type.isString(iso3166)) {
      return false;
    }

    return true;
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
