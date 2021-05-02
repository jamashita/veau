import { MutableSequence } from '@jamashita/lluvia-collection';

import { StatsItem } from '../StatsItem';
import { StatsItems } from '../StatsItems';

export class MockStatsItems extends StatsItems {
  public constructor(...items: Array<StatsItem>) {
    super(MutableSequence.ofArray<StatsItem>(items));
  }
}
