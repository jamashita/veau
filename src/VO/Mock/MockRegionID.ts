import { UUID } from 'publikum';
import { RegionID } from '../RegionID';

export class MockRegionID extends RegionID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
