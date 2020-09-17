import { ImmutableProject, Project } from '@jamashita/publikum-collection';

import { StatsID } from '../StatsID';
import { StatsOutline } from '../StatsOutline';
import { StatsOutlines } from '../StatsOutlines';

export class MockStatsOutlines extends StatsOutlines {
  private static toProject(outlines: ReadonlyArray<StatsOutline>): Project<StatsID, StatsOutline> {
    const map: Map<StatsID, StatsOutline> = new Map<StatsID, StatsOutline>();

    outlines.forEach((outline: StatsOutline) => {
      map.set(outline.getStatsID(), outline);
    });

    return ImmutableProject.of<StatsID, StatsOutline>(map);
  }

  public constructor(...outlines: ReadonlyArray<StatsOutline>) {
    super(MockStatsOutlines.toProject(outlines));
  }
}
