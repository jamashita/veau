import { AsOf } from '../../AsOf/AsOf';
import { MockAsOf } from '../../AsOf/mock/MockAsOf';
import { NumericalValue } from '../../NumericalValue/NumericalValue';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';
import { StatsValueError } from '../StatsValueError';

describe('StatsValue', () => {
  describe('ofJSON', () => {
    it('normal case', () => {
      const json: StatsValueJSON = {
        asOf: '2000-01-01',
        value: -1.1
      };

      const statsValue: StatsValue = StatsValue.ofJSON(json);

      expect(statsValue.getAsOf().toString()).toBe(json.asOf);
      expect(statsValue.getValue().get()).toBe(json.value);
    });

    it('asOf is mal format', () => {
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
      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: '2000-01-01',
        value: -1.1
      };

      const statsValue: StatsValue = StatsValue.ofRow(row);

      expect(statsValue.getAsOf().toString()).toBe(row.asOf);
      expect(statsValue.getValue().get()).toBe(row.value);
    });

    it('asOf is mal format', () => {
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

  describe('validate', () => {
    it('normal case', () => {
      const n: unknown = {
        asOf: '2000-01-01',
        value: 1
      };

      expect(StatsValue.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsValue.validate(null)).toBe(false);
      expect(StatsValue.validate(undefined)).toBe(false);
      expect(StatsValue.validate(56)).toBe(false);
      expect(StatsValue.validate('fjafsd')).toBe(false);
      expect(StatsValue.validate(false)).toBe(false);
    });

    it('returns false because asOf is missing', () => {
      const n: unknown = {
        value: -0.3
      };

      expect(StatsValue.validate(n)).toBe(false);
    });

    it('returns false because asOf is not string', () => {
      const n: unknown = {
        asOf: false,
        value: -0.3
      };

      expect(StatsValue.validate(n)).toBe(false);
    });

    it('returns false because value is missing', () => {
      const n: unknown = {
        asOf: '2000-01-01'
      };

      expect(StatsValue.validate(n)).toBe(false);
    });

    it('returns false because value is not number', () => {
      const n: unknown = {
        asOf: '2000-01-01',
        value: null
      };

      expect(StatsValue.validate(n)).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const value: StatsValue = StatsValue.of(new MockAsOf(), NumericalValue.of(1));

      expect(value.equals(null)).toBe(false);
      expect(value.equals(undefined)).toBe(false);
      expect(value.equals('')).toBe(false);
      expect(value.equals('123')).toBe(false);
      expect(value.equals('abcd')).toBe(false);
      expect(value.equals(123)).toBe(false);
      expect(value.equals(0)).toBe(false);
      expect(value.equals(-12)).toBe(false);
      expect(value.equals(0.3)).toBe(false);
      expect(value.equals(false)).toBe(false);
      expect(value.equals(true)).toBe(false);
      expect(value.equals(Symbol('p'))).toBe(false);
      expect(value.equals(20n)).toBe(false);
      expect(value.equals({})).toBe(false);
      expect(value.equals([])).toBe(false);
      expect(value.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      const statsValue1: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        NumericalValue.of(5)
      );
      const statsValue2: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 2
        }),
        NumericalValue.of(0)
      );
      const statsValue3: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        NumericalValue.of(-1)
      );
      const statsValue4: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        NumericalValue.of(1)
      );
      const statsValue5: StatsValue = StatsValue.of(
        new MockAsOf({
          day: 1
        }),
        NumericalValue.of(5)
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
      const statsValue: StatsValue = StatsValue.of(AsOf.ofString('2000-01-01'), NumericalValue.of(1));

      expect(statsValue.toJSON()).toStrictEqual({
        asOf: '2000-01-01',
        value: 1
      });
    });
  });
});
