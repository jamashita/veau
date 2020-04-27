import { ImmutableAddress } from 'publikum';
import { StatsValue } from '../StatsValue';
import { StatsValues } from '../StatsValues';

export class MockStatsValues extends StatsValues {

  public constructor(...values: Array<StatsValue>) {
    super(ImmutableAddress.of<StatsValue>(new Set(values)));
  }
}
