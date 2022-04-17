import { ISO3166 } from '../ISO3166';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';

type RegionArgs = Partial<Readonly<{
  regionID: RegionID;
  name: RegionName;
  iso3166: ISO3166;
}>>;

export class MockRegion extends Region {
  public constructor({
    regionID = RegionID.ofString('85e10be0-b949-40f2-aafc-d176ade48571'),
    name = RegionName.of('Afghanistan'),
    iso3166 = ISO3166.of('AFG')
  }: RegionArgs = {}) {
    super(regionID, name, iso3166);
  }
}
