import { ImmutableSequence } from '@jamashita/lluvia-collection';
import { StatsListItem } from '../StatsListItem';
import { StatsListItems } from '../StatsListItems';

export class MockStatsListItems extends StatsListItems {
  public constructor(...items: ReadonlyArray<StatsListItem>) {
    super(ImmutableSequence.of<StatsListItem>(items));
  }
}
