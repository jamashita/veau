import { StatsItems } from '../StatsItems';
import { StatsItem } from '../StatsItem';
import { Sequence } from '../../General/Collection/Sequence';

export class MockStatsItems extends StatsItems {

  public constructor(...items: Array<StatsItem>) {
    super(Sequence.of<StatsItem>(items));
  }
}
