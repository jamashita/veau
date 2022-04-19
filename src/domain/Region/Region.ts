import { ValueObject } from '@jamashita/anden-object';
import { JSONable, Kind } from '@jamashita/anden-type';
import { ISO3166 } from './ISO3166.js';
import { RegionID } from './RegionID.js';
import { RegionName } from './RegionName.js';

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

export class Region extends ValueObject implements JSONable<RegionJSON> {
  private readonly regionID: RegionID;
  private readonly name: RegionName;
  private readonly iso3166: ISO3166;

  private static readonly EMPTY: Region = new Region(
    RegionID.empty(),
    RegionName.empty(),
    ISO3166.empty()
  );

  public static empty(): Region {
    return Region.EMPTY;
  }

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

  public static ofJSON(json: RegionJSON): Region {
    return Region.of(
      RegionID.ofString(json.regionID),
      RegionName.of(json.name),
      ISO3166.of(json.iso3166)
    );
  }

  public static ofRow(row: RegionRow): Region {
    return Region.of(
      RegionID.ofString(row.regionID),
      RegionName.of(row.name),
      ISO3166.of(row.iso3166)
    );
  }

  public static validate(n: unknown): n is RegionJSON {
    if (!Kind.isObject<RegionJSON>(n)) {
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

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Region)) {
      return false;
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

  public getISO3166(): ISO3166 {
    return this.iso3166;
  }

  public getName(): RegionName {
    return this.name;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public isEmpty(): boolean {
    return this === Region.empty();
  }

  public serialize(): string {
    const props: Array<string> = [];

    props.push(this.regionID.toString());
    props.push(this.name.toString());
    props.push(this.iso3166.toString());

    return props.join(', ');
  }

  public toJSON(): RegionJSON {
    return {
      regionID: this.regionID.get().get(),
      name: this.name.get(),
      iso3166: this.iso3166.get()
    };
  }
}
