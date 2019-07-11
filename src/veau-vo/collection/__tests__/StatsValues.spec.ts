import 'jest';
import * as moment from 'moment';
import { StatsValue } from '../../StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  describe('set', () => {
    it('update pattern', () => {
      const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
      const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
      const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);
      const statsValues: StatsValues = StatsValues.of([
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

    it('insert pattern', () => {
      const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
      const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);
      const  statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue3
      ]);

      const set: StatsValues = statsValues.set(StatsValue.of(moment('2000-01-02'), 2));

      expect(set.length()).toEqual(3);
      expect(set.get(0).getValue()).toEqual(1);
      expect(set.get(1).getValue()).toEqual(2);
      expect(set.get(2).getValue()).toEqual(3);
    });
  });

  describe('delete', () => {
    it('deletes a element if its asOf is the same', () => {
      const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
      const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
      const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3
      ]);

      const deleted: StatsValues = statsValues.delete(moment('2000-01-02'));

      expect(deleted.length()).toEqual(2);
      expect(deleted.get(0).getValue()).toEqual(1);
      expect(deleted.get(1).getValue()).toEqual(3);
    });
  });

  describe('equals', () => {
    it('returns true if the elements and their order are the same', () => {
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
      ]);
      const statsValues4: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(false);
      expect(statsValues1.equals(statsValues3)).toEqual(false);
      expect(statsValues1.equals(statsValues4)).toEqual(true);
    });
  });
});
