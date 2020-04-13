import { StatsValues } from '../StatsValues';
import { StatsValue } from '../StatsValue';
import { Sequence } from '../../General/Collection/Sequence';

export class MockStatsValues extends StatsValues {

  public constructor(...values: Array<StatsValue>) {
    super(Sequence.of<StatsValue>(values));
  }
}
