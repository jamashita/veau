import { UUID } from '@jamashita/anden-uuid';
import { StatsValues } from '../../StatsValue/StatsValues';
import { StatsItem } from '../StatsItem';
import { StatsItemID } from '../StatsItemID';
import { StatsItemName } from '../StatsItemName';

type StatsItemArgs = Partial<Readonly<{
  statsItemID: StatsItemID;
  name: StatsItemName;
  values: StatsValues;
}>>;

export class MockStatsItem extends StatsItem {
  public constructor({
    statsItemID = StatsItemID.of(UUID.v4()),
    name = StatsItemName.of('ddf'),
    values = StatsValues.empty()
  }: StatsItemArgs = {}) {
    super(statsItemID, name, values);
  }
}
