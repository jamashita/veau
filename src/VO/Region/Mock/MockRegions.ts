import { ImmutableProject, Project } from '@jamashita/publikum-collection';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { Regions } from '../Regions';

export class MockRegions extends Regions {
  private static toProject(regions: Array<Region>): Project<RegionID, Region> {
    const map: Map<RegionID, Region> = new Map<RegionID, Region>();

    regions.forEach((region: Region) => {
      map.set(region.getRegionID(), region);
    });

    return ImmutableProject.of<RegionID, Region>(map);
  }

  public constructor(...regions: ReadonlyArray<Region>) {
    super(MockRegions.toProject([...regions]));
  }
}
