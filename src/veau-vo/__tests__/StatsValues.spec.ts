import 'jest';
import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { StatsItemID } from '../StatsItemID';
import { StatsValue } from '../StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  describe('set', () => {
    it('update pattern', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03'), NumericalValue.of(3));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3
      ]);

      const set: StatsValues = statsValues.set(StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(4)));

      expect(set.size()).toEqual(3);
      expect(set.get(0).getValue().get()).toEqual(1);
      expect(set.get(1).getValue().get()).toEqual(4);
      expect(set.get(2).getValue().get()).toEqual(3);
    });

    it('insert pattern', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03'), NumericalValue.of(3));
      const  statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue3
      ]);

      const set: StatsValues = statsValues.set(StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2)));

      expect(set.size()).toEqual(3);
      expect(set.get(0).getValue().get()).toEqual(1);
      expect(set.get(1).getValue().get()).toEqual(2);
      expect(set.get(2).getValue().get()).toEqual(3);
    });
  });

  describe('delete', () => {
    it('deletes a element if its asOf is the same', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03'), NumericalValue.of(3));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3
      ]);

      const deleted: StatsValues = statsValues.delete(AsOf.ofString('2000-01-02'));

      expect(deleted.size()).toEqual(2);
      expect(deleted.get(0).getValue().get()).toEqual(1);
      expect(deleted.get(1).getValue().get()).toEqual(3);
    });
  });

  describe('getValues', () => {
    it('extracts only their values', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(3);
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValues: StatsValues = StatsValues.of([
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), value1),
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-03'), value2)
      ]);

      expect(statsValues.getValues()).toEqual([
        value1,
        value2
      ]);
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-03');
      const statsValues: StatsValues = StatsValues.of([
        StatsValue.of(statsItemID, asOf1, NumericalValue.of(1)),
        StatsValue.of(statsItemID, asOf2, NumericalValue.of(3))
      ]);

      expect(statsValues.getAsOfs().size()).toEqual(2);
      expect(statsValues.getAsOfs().get(0)).toEqual(asOf1);
      expect(statsValues.getAsOfs().get(1)).toEqual(asOf2);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03'), NumericalValue.of(3));
      const statsValue4: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
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
    it('returns true if the elements are 0', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2));
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

  describe('filter', () => {
    it('only returns a certain StatsItemID\'s StatsValue', () => {
      const statsItemID1: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsItemID2: StatsItemID = StatsItemID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4');
      const statsValue1: StatsValue = StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID2, AsOf.ofString('2000-01-02'), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID2, AsOf.ofString('2000-01-03'), NumericalValue.of(3));
      const statsValue4: StatsValue = StatsValue.of(statsItemID1, AsOf.ofString('2000-01-04'), NumericalValue.of(1));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3,
        statsValue4
      ]);

      const filtered1: StatsValues = statsValues.filter(statsItemID1);
      const filtered2: StatsValues = statsValues.filter(statsItemID2);

      expect(filtered1.size()).toEqual(2);
      expect(filtered1.get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(filtered1.get(1).getAsOfAsString()).toEqual('2000-01-04');
      expect(filtered2.size()).toEqual(2);
      expect(filtered2.get(0).getAsOfAsString()).toEqual('2000-01-02');
      expect(filtered2.get(1).getAsOfAsString()).toEqual('2000-01-03');
    });
  });

  describe('equals', () => {
    it('returns false if the length is differnet', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2));

      const statsValues1: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue1
      ]);

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2));

      const statsValues1: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue2,
        statsValue1
      ]);

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(false);
    });

    it('returns true if the elements and their order are the same', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02'), NumericalValue.of(2));

      const statsValues1: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(true);
    });
  });
});
