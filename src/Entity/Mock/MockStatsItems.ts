import { StatsItems } from '../StatsItems';
import { StatsItem } from '../StatsItem';
import { ImmutableSequence } from '../../General/Collection/ImmutableSequence';

export class MockStatsItems extends StatsItems {

  public constructor(...items: Array<StatsItem>) {
    super(ImmutableSequence.of<StatsItem>(items));
  }
}
