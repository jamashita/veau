import { UUID } from '@jamashita/publikum-uuid';

import { StatsItemID } from '../StatsItemID';

export class MockStatsItemID extends StatsItemID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
