import { ImmutableSequence } from '@jamashita/lluvia-collection';
import { StatsItemName } from '../StatsItemName';
import { StatsItemNames } from '../StatsItemNames';

export class MockStatsItemNames extends StatsItemNames {
  public constructor(...names: ReadonlyArray<StatsItemName>) {
    super(ImmutableSequence.ofArray<StatsItemName>(names));
  }
}
