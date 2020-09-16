import { ImmutableSequence } from '@jamashita/publikum-collection';

import { StatsItemDisplay } from '../StatsItemDisplay';
import { StatsItemDisplays } from '../StatsItemDisplays';

export class MockStatsItemDisplays extends StatsItemDisplays {
  public constructor(...items: ReadonlyArray<StatsItemDisplay>) {
    super(ImmutableSequence.of<StatsItemDisplay>(items));
  }
}
