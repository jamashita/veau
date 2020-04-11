import {StatsValues} from '../StatsValues';
import {StatsValue} from '../StatsValue';
import {MockSequence} from '../../veau-general/Collection/Mock/MockSequence';

export class MockStatsValues extends StatsValues {

  public constructor(...values: Array<StatsValue>) {
    super(new MockSequence<StatsValue>(values));
  }
}
