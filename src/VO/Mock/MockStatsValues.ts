import { ImmutableProject, Project } from 'publikum';
import { AsOf } from '../AsOf';
import { StatsValue } from '../StatsValue';
import { StatsValues } from '../StatsValues';

export class MockStatsValues extends StatsValues {

  private static toProject(values: Array<StatsValue>): Project<AsOf, StatsValue> {
    let project: ImmutableProject<AsOf, StatsValue> = ImmutableProject.empty<AsOf, StatsValue>();

    values.forEach((value: StatsValue) => {
      project = project.set(value.getAsOf(), value);
    });

    return project;
  }

  public constructor(...values: Array<StatsValue>) {
    super(MockStatsValues.toProject(values));
  }
}
