import { ImmutableSequence } from '@jamashita/publikum-collection';

import { StatsItemDisplay } from '../StatsItemDisplay';
import { StatsItemDisplays } from 'src/VO/Display/StatsItemDisplays';

export class MockStatsItemDisplays extends StatsItemDisplays {
  public constructor(...items: Array<StatsItemDisplay>) {
    super(ImmutableSequence.of<StatsItemDisplay>(items));
  }
}
