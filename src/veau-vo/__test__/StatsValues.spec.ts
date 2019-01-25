import 'jest';
import * as moment from 'moment';
import { StatsValue } from '../StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  it('setStatsValue: update pattern', () => {
    const statsValue1: StatsValue = StatsValue.of(moment.utc('2000-01-01'), 1);
    const statsValue2: StatsValue = StatsValue.of(moment.utc('2000-01-02'), 2)
    const statsValue3: StatsValue = StatsValue.of(moment.utc('2000-01-03'), 3);

    const statsValues: StatsValues = StatsValues.of([
      statsValue1,
      statsValue2,
      statsValue3
    ]);

    statsValues.setStatsValue(StatsValue.of(moment.utc('2000-01-02'), 4));

    expect(statsValues.get().length).toEqual(3);
    expect(statsValues.get()[0].getValue()).toEqual(1);
    expect(statsValues.get()[1].getValue()).toEqual(4);
    expect(statsValues.get()[2].getValue()).toEqual(3);
  });

  it('setStatsValue: insert pattern', () => {
    const statsValue1: StatsValue = StatsValue.of(moment.utc('2000-01-01'), 1);
    const statsValue3: StatsValue = StatsValue.of(moment.utc('2000-01-03'), 3);

    const statsValues: StatsValues = StatsValues.of([
      statsValue1,
      statsValue3
    ]);

    statsValues.setStatsValue(StatsValue.of(moment.utc('2000-01-02'), 2));

    expect(statsValues.get().length).toEqual(3);
    expect(statsValues.get()[0].getValue()).toEqual(1);
    expect(statsValues.get()[1].getValue()).toEqual(2);
    expect(statsValues.get()[2].getValue()).toEqual(3);
  });
});
