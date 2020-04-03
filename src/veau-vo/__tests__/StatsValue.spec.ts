import 'jest';
import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { StatsItemID } from '../StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';

describe('StatsValue', () => {
  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const statsValue1: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(0));
      const statsValue2: StatsValue = StatsValue.of(StatsItemID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(0));
      const statsValue3: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(0));
      const statsValue4: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(-1));
      const statsValue5: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue6: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(0));

      expect(statsValue1.equals(statsValue1)).toEqual(true);
      expect(statsValue1.equals(statsValue2)).toEqual(false);
      expect(statsValue1.equals(statsValue3)).toEqual(false);
      expect(statsValue1.equals(statsValue4)).toEqual(false);
      expect(statsValue1.equals(statsValue5)).toEqual(false);
      expect(statsValue1.equals(statsValue6)).toEqual(true);
    });
  });

  describe('isBefore', () => {
    it('returns true if the asOf is before than the other StatsValue', () => {
      const statsValue1: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(0));
      const statsValue2: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(0));
      const statsValue3: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(0));

      expect(statsValue2.isBefore(statsValue1)).toEqual(false);
      expect(statsValue2.isBefore(statsValue3)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsValue: StatsValue = StatsValue.of(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));

      expect(statsValue.toJSON()).toEqual({
        asOf: '2000-01-01',
        value: 1
      });
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const asOf: string = '2000-01-01';
      const value: number = 1;
      const statsValue: StatsValue = StatsValue.of(StatsItemID.of(id).get(), AsOf.ofString(asOf).get(), NumericalValue.of(value));

      expect(statsValue.toString()).toEqual(`${id} ${asOf} ${value}`);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: StatsValueJSON = {
        asOf: '2000-01-01 00:00:00',
        value: -1.1
      };

      const statsValue: StatsValue = StatsValue.ofJSON(StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), json);

      expect(statsValue.getStatsItemID().get()).toEqual('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      expect(statsValue.getAsOfAsString()).toEqual('2000-01-01');
      expect(statsValue.getValue().get()).toEqual(-1.1);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: '2000-01-01 00:00:00',
        value: -1.1
      };

      const statsValue: StatsValue = StatsValue.ofRow(row);

      expect(statsValue.getStatsItemID().get()).toEqual('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      expect(statsValue.getAsOfAsString()).toEqual('2000-01-01');
      expect(statsValue.getValue().get()).toEqual(-1.1);
    });
  });
});
