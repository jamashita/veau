import { AsOf } from '../../AsOf/AsOf';
import { MockAsOf } from '../../AsOf/mock/MockAsOf';
import { NumericalValue } from '../../NumericalValue/NumericalValue';
import { StatsValue } from '../StatsValue';

type StatsValueArgs = Partial<Readonly<{
  asOf: AsOf;
  value: NumericalValue;
}>>;

export class MockStatsValue extends StatsValue {
  public constructor({ asOf = new MockAsOf(), value = NumericalValue.of(0) }: StatsValueArgs = {}) {
    super(asOf, value);
  }
}
