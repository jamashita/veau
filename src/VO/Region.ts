import { JSONable } from '../General/Interface/JSONable';
import { Type } from '../General/Type/Type';
import { ValueObject } from '../General/ValueObject';
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

  private static readonly EMPTY: Region = new Region(
    RegionID.empty(),
    RegionName.empty(),
    ISO3166.empty()
  );

  public static of(
    regionID: RegionID,
    name: RegionName,
    iso3166: ISO3166
  ): Region {
    if (regionID.isEmpty()) {
      if (name.isEmpty()) {
        if (iso3166.isEmpty()) {
          return Region.empty();
        }
      }
    }

    return new Region(regionID, name, iso3166);
  }

  public static ofJSON(json: RegionJSON): Region {
    return Region.of(
      RegionID.of(json.regionID),
      RegionName.of(json.name),
      ISO3166.of(json.iso3166)
    );
  }

  public static ofRow(row: RegionRow): Region {
    return Region.of(
      RegionID.of(row.regionID),
      RegionName.of(row.name),
      ISO3166.of(row.iso3166)
    );
  }

  public static empty(): Region {
    return Region.EMPTY;
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

  protected constructor(
    regionID: RegionID,
    name: RegionName,
    iso3166: ISO3166
  ) {
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

    const {
      regionID,
      name,
      iso3166
    } = this;

    if (!regionID.equals(other.regionID)) {
      return false;
    }
    if (!name.equals(other.name)) {
      return false;
    }
    if (!iso3166.equals(other.iso3166)) {
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
