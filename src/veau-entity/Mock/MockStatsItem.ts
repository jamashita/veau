import { StatsItem } from '../StatsItem';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsValues } from '../../veau-vo/StatsValues';
import { MockStatsItemID } from '../../veau-vo/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../veau-vo/Mock/MockStatsItemName';
import { MockStatsValues } from '../../veau-vo/Mock/MockStatsValues';

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
