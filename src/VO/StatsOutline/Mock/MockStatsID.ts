import { UUID } from '@jamashita/anden-uuid';
import { StatsID } from '../StatsID';

export class MockStatsID extends StatsID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
