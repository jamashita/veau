import { StatsValue } from '../StatsValue';
import { StatsItemID } from '../StatsItemID';
import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { MockStatsItemID } from './MockStatsItemID';
import { MockAsOf } from './MockAsOf';
import { MockNumericalValue } from './MockNumericalValue';

type StatsValueArgs = Partial<Readonly<{
  statsItemID: StatsItemID;
  asOf: AsOf;
  value: NumericalValue;
}>>;

export class MockStatsValue extends StatsValue {

  public constructor({
    statsItemID = new MockStatsItemID(),
    asOf = new MockAsOf(),
    value = new MockNumericalValue()
  }: StatsValueArgs = {}) {
    super(statsItemID, asOf, value);
  }
}
