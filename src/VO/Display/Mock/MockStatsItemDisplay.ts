import { MockStatsItemID } from '../../StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../StatsItem/Mock/MockStatsItemName';
import { StatsItemID } from '../../StatsItem/StatsItemID';
import { StatsItemName } from '../../StatsItem/StatsItemName';
import { MockStatsValues } from '../../StatsValue/Mock/MockStatsValues';
import { StatsValues } from '../../StatsValue/StatsValues';
import { StatsItemDisplay } from '../StatsItemDisplay';

type StatsItemArgs = Partial<Readonly<{
  statsItemID: StatsItemID;
  name: StatsItemName;
  values: StatsValues;
}>>;

export class MockStatsItemDisplay extends StatsItemDisplay {
  public constructor({
    statsItemID = new MockStatsItemID(),
    name = new MockStatsItemName(),
    values = new MockStatsValues()
  }: StatsItemArgs = {}) {
    super(statsItemID, name, values);
  }
}
