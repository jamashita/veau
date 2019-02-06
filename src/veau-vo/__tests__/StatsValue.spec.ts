/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsValue } from '../StatsValue';

describe('StatsValue', () => {
  it('equals', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 0);
    const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 0);
    const statsValue3: StatsValue = StatsValue.of(moment('2000-01-01'), 0);
    const statsValue4: StatsValue = StatsValue.of(moment('2000-01-01'), -1);
    const statsValue5: StatsValue = StatsValue.of(moment('2000-01-01'), 1);

    expect(statsValue1.equals(statsValue1)).toEqual(true);
    expect(statsValue1.equals(statsValue2)).toEqual(false);
    expect(statsValue1.equals(statsValue3)).toEqual(true);
    expect(statsValue1.equals(statsValue4)).toEqual(false);
    expect(statsValue1.equals(statsValue5)).toEqual(false);
  });

  it('toJSON', () => {
    const statsValue: StatsValue = StatsValue.of(moment('2000-01-01'), 1);

    expect(statsValue.toJSON()).toEqual({
      asOf: '2000-01-01',
      value: 1
    });
  });
});
