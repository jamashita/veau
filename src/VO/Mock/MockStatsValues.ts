import { ImmutableProject, Project } from 'publikum';
import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { StatsValue } from '../StatsValue';
import { StatsValues } from '../StatsValues';

export class MockStatsValues extends StatsValues {

  private static toProject(values: Array<StatsValue>): Project<AsOf, NumericalValue> {
    const project: ImmutableProject<AsOf, NumericalValue> = ImmutableProject.empty<AsOf, NumericalValue>();

    values.map<ImmutableProject<AsOf, NumericalValue>>((value: StatsValue) => {
      return project.set(value.getAsOf(), value.getValue());
    });

    return project;
  }

  public constructor(...values: Array<StatsValue>) {
    super(MockStatsValues.toProject(values));
  }
}
