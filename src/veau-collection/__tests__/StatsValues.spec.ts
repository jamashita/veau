/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsValue } from '@/veau-vo/StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  it('set: update pattern', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
    const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);
    const statsValues: StatsValues = new StatsValues([
      statsValue1,
      statsValue2,
      statsValue3
    ]);

    const set: StatsValues = statsValues.set(StatsValue.of(moment('2000-01-02'), 4));

    expect(set.length()).toEqual(3);
    expect(set.get(0).getValue()).toEqual(1);
    expect(set.get(1).getValue()).toEqual(4);
    expect(set.get(2).getValue()).toEqual(3);
  });

  it('set: insert pattern', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);
    const  statsValues: StatsValues = new StatsValues([
      statsValue1,
      statsValue3
    ]);

    const set: StatsValues = statsValues.set(StatsValue.of(moment('2000-01-02'), 2));

    expect(set.length()).toEqual(3);
    expect(set.get(0).getValue()).toEqual(1);
    expect(set.get(1).getValue()).toEqual(2);
    expect(set.get(2).getValue()).toEqual(3);
  });

  it('delete', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
    const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);
    const statsValues: StatsValues = new StatsValues([
      statsValue1,
      statsValue2,
      statsValue3
    ]);

    const deleted: StatsValues = statsValues.delete(moment('2000-01-02'));

    expect(deleted.length()).toEqual(2);
    expect(deleted.get(0).getValue()).toEqual(1);
    expect(deleted.get(1).getValue()).toEqual(3);
  });

  it('equals', () => {
    const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
    const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);

    const statsValues1: StatsValues = new StatsValues([
      statsValue1,
      statsValue2
    ]);
    const statsValues2: StatsValues = new StatsValues([
      statsValue1
    ]);
    const statsValues3: StatsValues = new StatsValues([
      statsValue2,
      statsValue1
    ]);

    expect(statsValues1.equals(statsValues1)).toEqual(true);
    expect(statsValues1.equals(statsValues2)).toEqual(false);
    expect(statsValues1.equals(statsValues3)).toEqual(false);
  });
});
