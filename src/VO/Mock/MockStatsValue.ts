import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { StatsItemID } from '../StatsItemID';
import { StatsValue } from '../StatsValue';
import { MockAsOf } from './MockAsOf';
import { MockNumericalValue } from './MockNumericalValue';
import { MockStatsItemID } from './MockStatsItemID';

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
