import { ImmutableSequence } from 'publikum';
import { StatsListItem } from '../StatsListItem';
import { StatsListItems } from '../StatsListItems';

export class MockStatsListItems extends StatsListItems {

  public constructor(...items: Array<StatsListItem>) {
    super(ImmutableSequence.of<StatsListItem>(items));
  }
}
