import { MockStatsItemID } from '../../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { StatsItemID } from '../../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { StatsValues } from '../../../VO/StatsValue/StatsValues';
import { StatsItem } from '../StatsItem';

type StatsItemArgs = Partial<Readonly<{
  statsItemID: StatsItemID;
  name: StatsItemName;
  values: StatsValues;
}>>;

export class MockStatsItem extends StatsItem {
  public constructor({
    statsItemID = new MockStatsItemID(),
    name = new MockStatsItemName(),
    values = new MockStatsValues()
  }: StatsItemArgs = {}) {
    super(statsItemID, name, values);
  }
}
