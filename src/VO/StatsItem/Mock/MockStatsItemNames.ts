import { ImmutableSequence } from '@jamashita/publikum-collection';
import { StatsItemName } from '../StatsItemName';
import { StatsItemNames } from '../StatsItemNames';

export class MockStatsItemNames extends StatsItemNames {
  public constructor(...names: ReadonlyArray<StatsItemName>) {
    super(ImmutableSequence.of<StatsItemName>([...names]));
  }
}
