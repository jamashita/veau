import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { StatsValue } from '../StatsValue';
import { MockAsOf } from './MockAsOf';
import { MockNumericalValue } from './MockNumericalValue';

type StatsValueArgs = Partial<Readonly<{
  asOf: AsOf;
  value: NumericalValue;
}>>;

export class MockStatsValue extends StatsValue {

  public constructor({
    asOf = new MockAsOf(),
    value = new MockNumericalValue()
  }: StatsValueArgs = {}) {
    super(asOf, value);
  }
}
