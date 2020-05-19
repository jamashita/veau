import { UUID } from 'publikum';

import { StatsItemID } from '../StatsItemID';

export class MockStatsItemID extends StatsItemID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
