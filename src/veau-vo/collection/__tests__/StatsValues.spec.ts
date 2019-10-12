import 'jest';
import moment from 'moment';
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

      expect(set.size()).toEqual(3);
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

      expect(set.size()).toEqual(3);
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

      expect(deleted.size()).toEqual(2);
      expect(deleted.get(0).getValue()).toEqual(1);
      expect(deleted.get(1).getValue()).toEqual(3);
    });
  });

  describe('getValues', () => {
    it('extracts only their values', () => {
      const value1: number = 1;
      const value2: number = 3;
      const statsValues: StatsValues = StatsValues.of([
        StatsValue.of(moment('2000-01-01'), value1),
        StatsValue.of(moment('2000-01-03'), value2)
      ]);

      expect(statsValues.getValues()).toEqual([
        value1,
        value2
      ]);
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      const asOf1: moment.Moment = moment('2000-01-01');
      const asOf2: moment.Moment = moment('2000-01-03');
      const statsValues: StatsValues = StatsValues.of([
        StatsValue.of(asOf1, 1),
        StatsValue.of(asOf2, 3)
      ]);

      expect(statsValues.getAsOfs()).toEqual([
        asOf1,
        asOf2
      ]);
    });
  });

  describe('contains', () => {
    it('return true if the element exists in the Colors', () => {
      const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
      const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
      const statsValue3: StatsValue = StatsValue.of(moment('2000-01-03'), 3);
      const statsValue4: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues.contains(statsValue1)).toEqual(true);
      expect(statsValues.contains(statsValue2)).toEqual(true);
      expect(statsValues.contains(statsValue3)).toEqual(false);
      expect(statsValues.contains(statsValue4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('return true if the elements are 0', () => {
      const statsValue1: StatsValue = StatsValue.of(moment('2000-01-01'), 1);
      const statsValue2: StatsValue = StatsValue.of(moment('2000-01-02'), 2);
      const statsValues1: StatsValues = StatsValues.of([
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues1.isEmpty()).toEqual(true);
      expect(statsValues2.isEmpty()).toEqual(false);
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
