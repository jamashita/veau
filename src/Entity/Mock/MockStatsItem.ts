import { MockStatsItemID } from '../../VO/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../VO/Mock/MockStatsItemName';
import { MockStatsValues } from '../../VO/Mock/MockStatsValues';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsItemName } from '../../VO/StatsItemName';
import { StatsValues } from '../../VO/StatsValues';
import { StatsItem } from '../StatsItem';

type StatsItemArgs = Partial<
  Readonly<{
    statsItemID: StatsItemID;
    name: StatsItemName;
    values: StatsValues;
  }>
>;

export class MockStatsItem extends StatsItem {
  public constructor({
    statsItemID = new MockStatsItemID(),
    name = new MockStatsItemName(),
    values = new MockStatsValues()
  }: StatsItemArgs = {}) {
    super(statsItemID, name, values);
  }
}
