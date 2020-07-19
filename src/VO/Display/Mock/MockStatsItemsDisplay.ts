import { ImmutableSequence } from '@jamashita/publikum-collection';

import { StatsItemDisplay } from '../StatsItemDisplay';
import { StatsItemsDisplay } from '../StatsItemsDisplay';

export class MockStatsItemsDisplay extends StatsItemsDisplay {
  public constructor(...items: Array<StatsItemDisplay>) {
    super(ImmutableSequence.of<StatsItemDisplay>(items));
  }
}
