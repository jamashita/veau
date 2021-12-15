import { ImmutableSequence } from '@jamashita/lluvia-collection';
import { StatsListItem } from '../StatsListItem';
import { StatsListItems } from '../StatsListItems';

export class MockStatsListItems extends StatsListItems {
  public constructor(...items: Array<StatsListItem>) {
    super(ImmutableSequence.ofArray<StatsListItem>(items));
  }
}
