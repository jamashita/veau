import {ISO3166} from '../ISO3166';
import {Region} from '../Region';
import {RegionID} from '../RegionID';
import {RegionName} from '../RegionName';
import {MockRegionID} from './MockRegionID';
import {MockRegionName} from './MockRegionName';
import {MockISO3166} from './MockISO3166';

type RegionArgs = Partial<Readonly<{
  regionID: RegionID;
  name: RegionName;
  iso3166: ISO3166;
}>>;

export class MockRegion extends Region {

  public constructor({
    regionID = new MockRegionID(),
    name = new MockRegionName(),
    iso3166 = new MockISO3166()
  }: RegionArgs = {}) {
    super(regionID, name, iso3166);
  }
}
