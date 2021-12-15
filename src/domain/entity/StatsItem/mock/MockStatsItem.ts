import { MockStatsItemID } from '../../../vo/StatsItem/mock/MockStatsItemID';
import { MockStatsItemName } from '../../../vo/StatsItem/mock/MockStatsItemName';
import { StatsItemID } from '../../../vo/StatsItem/StatsItemID';
import { StatsItemName } from '../../../vo/StatsItem/StatsItemName';
import { StatsValues } from '../../../vo/StatsValue/StatsValues';
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
    values = StatsValues.empty()
  }: StatsItemArgs = {}) {
    super(statsItemID, name, values);
  }
}
