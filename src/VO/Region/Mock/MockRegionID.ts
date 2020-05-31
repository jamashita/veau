import { UUID } from '@jamashita/publikum-uuid';

import { RegionID } from '../RegionID';

export class MockRegionID extends RegionID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
