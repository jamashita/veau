import { AsOf } from '../../AsOf/AsOf';
import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockNumericalValue } from '../../NumericalValue/Mock/MockNumericalValue';
import { NumericalValue } from '../../NumericalValue/NumericalValue';
import { StatsValueError } from '../Error/StatsValueError';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';

describe('StatsValue', () => {
  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(2);

      const json: StatsValueJSON = {
        asOf: '2000-01-01',
        value: -1.1
      };

      const statsValue: StatsValue = StatsValue.ofJSON(json);

      expect(statsValue.getAsOf().toString()).toBe(json.asOf);
      expect(statsValue.getValue().get()).toBe(json.value);
    });

    it('asOf is malformat', () => {
      expect.assertions(1);

      const json: StatsValueJSON = {
        asOf: 'illegal datetime',
        value: -1.1
      };

      expect(() => {
        StatsValue.ofJSON(json);
      }).toThrow(StatsValueError);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      expect.assertions(2);

      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: '2000-01-01',
        value: -1.1
      };

      const statsValue: StatsValue = StatsValue.ofRow(row);

      expect(statsValue.getAsOf().toString()).toBe(row.asOf);
      expect(statsValue.getValue().get()).toBe(row.value);
    });

    it('asOf is malformat', () => {
      expect.assertions(1);

      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: 'illegal asOf format',
        value: -1.1
      };

      expect(() => {
        StatsValue.ofRow(row);
      }).toThrow(StatsValueError);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = {
        asOf: '2000-01-01',
        value: 1
      };

      expect(StatsValue.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(StatsValue.isJSON(null)).toBe(false);
      expect(StatsValue.isJSON(undefined)).toBe(false);
      expect(StatsValue.isJSON(56)).toBe(false);
      expect(StatsValue.isJSON('fjafsd')).toBe(false);
      expect(StatsValue.isJSON(false)).toBe(false);
    });

    it('returns false because asOf is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        value: -0.3
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });

    it('returns false because asOf is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        asOf: false,
        value: -0.3
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });

    it('returns false because value is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        asOf: '2000-01-01'
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });

    it('returns false because value is not number', () => {
      expect.assertions(1);

      const n: unknown = {
        asOf: '2000-01-01',
        value: null
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      expect.assertions(5);

      const statsValue1: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(5)
      );
      const statsValue2: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 2
        }),
        new MockNumericalValue(0)
      );
      const statsValue3: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(-1)
      );
      const statsValue4: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(1)
      );
      const statsValue5: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(5)
      );

      expect(statsValue1.equals(statsValue1)).toBe(true);
      expect(statsValue1.equals(statsValue2)).toBe(false);
      expect(statsValue1.equals(statsValue3)).toBe(false);
      expect(statsValue1.equals(statsValue4)).toBe(false);
      expect(statsValue1.equals(statsValue5)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const statsValue: StatsValue = StatsValue.of(AsOf.ofString('2000-01-01'), NumericalValue.of(1));

      expect(statsValue.toJSON()).toStrictEqual({
        asOf: '2000-01-01',
        value: 1
      });
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const asOf: string = '2000-01-01';
      const value: number = 1;
      const statsValue: StatsValue = StatsValue.of(AsOf.ofString(asOf), NumericalValue.of(value));

      expect(statsValue.toString()).toBe(`${asOf} ${value}`);
    });
  });
});
