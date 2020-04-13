import { StatsValues } from '../StatsValues';
import { StatsValue } from '../StatsValue';
import { ImmutableSequence } from '../../General/Collection/ImmutableSequence';

export class MockStatsValues extends StatsValues {

  public constructor(...values: Array<StatsValue>) {
    super(ImmutableSequence.of<StatsValue>(values));
  }
}
