import { StatsItems } from '../StatsItems';
import { StatsItem } from '../StatsItem';
import { MockSequence } from '../../General/Collection/Mock/MockSequence';

export class MockStatsItems extends StatsItems {

  public constructor(...items: Array<StatsItem>) {
    super(new MockSequence<StatsItem>(items));
  }
}
