import { ImmutableProject, Project } from '@jamashita/publikum-collection';
import { AsOf } from '../../AsOf/AsOf';
import { StatsValue } from '../StatsValue';
import { StatsValues } from '../StatsValues';

export class MockStatsValues extends StatsValues {
  private static toProject(values: Array<StatsValue>): Project<AsOf, StatsValue> {
    const map: Map<AsOf, StatsValue> = new Map<AsOf, StatsValue>();

    values.forEach((value: StatsValue) => {
      map.set(value.getAsOf(), value);
    });

    return ImmutableProject.ofMap<AsOf, StatsValue>(map);
  }

  public constructor(...values: ReadonlyArray<StatsValue>) {
    super(MockStatsValues.toProject([...values]));
  }
}
