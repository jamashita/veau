import { Region, RegionJSON, RegionRow } from '@/veau-entity/Region';
import { ISO3166 } from '@/veau-vo/ISO3166';
import { RegionID } from '@/veau-vo/RegionID';

export class RegionFactory {
  private static instance: RegionFactory = new RegionFactory();

  public static getInstance(): RegionFactory {
    return RegionFactory.instance;
  }

  private constructor() {
  }

  public from(regionID: RegionID, name: string, iso3166: ISO3166): Region {
    return new Region(regionID, name, iso3166);
  }

  public fromJSON(json: RegionJSON): Region {
    const {
      regionID,
      name,
      iso3166
    } = json;

    return new Region(RegionID.of(regionID), name, ISO3166.of(iso3166));
  }

  public fromRow(row: RegionRow): Region {
    const {
      regionID,
      name,
      iso3166
    } = row;

    return new Region(RegionID.of(regionID), name, ISO3166.of(iso3166));
  }
}
