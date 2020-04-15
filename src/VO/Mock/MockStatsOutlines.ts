import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { StatsOutline } from '../StatsOutline';
import { StatsOutlines } from '../StatsOutlines';

export class MockStatsOutlines extends StatsOutlines {

  public constructor(...outlines: Array<StatsOutline>) {
    super(ImmutableSequence.of<StatsOutline>(outlines));
  }
}
