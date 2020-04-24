import { ImmutableSequence } from 'publikum';
import { StatsValue } from '../StatsValue';
import { StatsValues } from '../StatsValues';

export class MockStatsValues extends StatsValues {

  public constructor(...values: Array<StatsValue>) {
    super(ImmutableSequence.of<StatsValue>(values));
  }
}
