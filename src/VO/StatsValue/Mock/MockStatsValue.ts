import { AsOf } from '../../AsOf/AsOf';
import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockNumericalValue } from '../../NumericalValue/Mock/MockNumericalValue';
import { NumericalValue } from '../../NumericalValue/NumericalValue';
import { StatsValue } from '../StatsValue';

type StatsValueArgs = Partial<
  Readonly<{
    asOf: AsOf;
    value: NumericalValue;
  }>
>;

export class MockStatsValue extends StatsValue {
  public constructor({ asOf = new MockAsOf(), value = new MockNumericalValue() }: StatsValueArgs = {}) {
    super(asOf, value);
  }
}
