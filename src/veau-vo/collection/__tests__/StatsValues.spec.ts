/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsValue } from '../../StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  it('setStatsValue: update pattern', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
    const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);

    const statsValues: StatsValues = StatsValues.of([
      statsValue1,
      statsValue2,
      statsValue3
    ]);

    statsValues.setStatsValue(StatsValue.of(moment('2000-01-02'), 4));

    expect(statsValues.get().length).toEqual(3);
    expect(statsValues.get()[0].getValue()).toEqual(1);
    expect(statsValues.get()[1].getValue()).toEqual(4);
    expect(statsValues.get()[2].getValue()).toEqual(3);
  });

  it('setStatsValue: insert pattern', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);

    const statsValues: StatsValues = StatsValues.of([
      statsValue1,
      statsValue3
    ]);

    statsValues.setStatsValue(StatsValue.of(moment('2000-01-02'), 2));

    expect(statsValues.get().length).toEqual(3);
    expect(statsValues.get()[0].getValue()).toEqual(1);
    expect(statsValues.get()[1].getValue()).toEqual(2);
    expect(statsValues.get()[2].getValue()).toEqual(3);
  });

  it('deleteStatsValue', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
    const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);

    const statsValues: StatsValues = StatsValues.of([
      statsValue1,
      statsValue2,
      statsValue3
    ]);

    statsValues.deleteStatsValue(moment('2000-01-02'));

    expect(statsValues.get().length).toEqual(2);
    expect(statsValues.get()[0].getValue()).toEqual(1);
    expect(statsValues.get()[1].getValue()).toEqual(3);
  });

  it('equals', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);

    const statsValues1: StatsValues = StatsValues.of([
      statsValue1,
      statsValue2
    ]);
    const statsValues2: StatsValues = StatsValues.of([
      statsValue1
    ]);
    const statsValues3: StatsValues = StatsValues.of([
      statsValue2,
      statsValue1
    ])

    expect(statsValues1.equals(statsValues1)).toEqual(true);
    expect(statsValues1.equals(statsValues2)).toEqual(false);
    expect(statsValues1.equals(statsValues3)).toEqual(false);
  });
});
