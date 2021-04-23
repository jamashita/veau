import { ImmutableSequence } from '@jamashita/lluvia-collection';

import { StatsItem } from '../StatsItem';
import { StatsItems } from '../StatsItems';

export class MockStatsItems extends StatsItems {
  public constructor(...items: ReadonlyArray<StatsItem>) {
    super(ImmutableSequence.ofArray<StatsItem>(items));
  }
}
