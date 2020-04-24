import { ImmutableSequence } from 'publikum';
import { StatsItem } from '../StatsItem';
import { StatsItems } from '../StatsItems';

export class MockStatsItems extends StatsItems {

  public constructor(...items: Array<StatsItem>) {
    super(ImmutableSequence.of<StatsItem>(items));
  }
}
