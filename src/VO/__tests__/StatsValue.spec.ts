import { Superposition, UUID } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { StatsValueError } from '../../Error/StatsValueError';
import { AsOf } from '../AsOf';
import { MockAsOf } from '../Mock/MockAsOf';
import { MockNumericalValue } from '../Mock/MockNumericalValue';
import { MockStatsItemID } from '../Mock/MockStatsItemID';
import { NumericalValue } from '../NumericalValue';
import { StatsItemID } from '../StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';

describe('StatsValue', () => {
  describe('ofJSON', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();
      const json: StatsValueJSON = {
        asOf: '2000-01-01',
        value: -1.1
      };

      const superposition: Superposition<StatsValue, StatsValueError> = StatsValue.ofJSON(
        StatsItemID.of(uuid),
        json
      );

      expect(superposition.isAlive()).toBe(true);
      const statsValue: StatsValue = superposition.get();
      expect(statsValue.getStatsItemID().get()).toBe(uuid);
      expect(statsValue.getAsOf().toString()).toBe(json.asOf);
      expect(statsValue.getValue().get()).toBe(json.value);
    });

    it('asOf is malformat', () => {
      const json: StatsValueJSON = {
        asOf: 'illegal datetime',
        value: -1.1
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsValue, StatsValueError> = StatsValue.ofJSON(
        new MockStatsItemID(),
        json
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValueError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValueError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: '2000-01-01',
        value: -1.1
      };

      const superposition: Superposition<StatsValue, StatsValueError> = StatsValue.ofRow(row);

      expect(superposition.isAlive()).toBe(true);
      const statsValue: StatsValue = superposition.get();
      expect(statsValue.getStatsItemID().get().get()).toBe(row.statsItemID);
      expect(statsValue.getAsOf().toString()).toBe(row.asOf);
      expect(statsValue.getValue().get()).toBe(row.value);
    });

    it('statsItemID is malformat', () => {
      const row: StatsValueRow = {
        statsItemID: 'illegal uuid',
        asOf: '2000-01-01',
        value: -1.1
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsValue, StatsValueError> = StatsValue.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValueError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValueError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('asOf is malformat', () => {
      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: 'illegal asOf format',
        value: -1.1
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsValue, StatsValueError> = StatsValue.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValueError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValueError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        asOf: '2000-01-01',
        value: 1
      };

      expect(StatsValue.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsValue.isJSON(null)).toBe(false);
      expect(StatsValue.isJSON(undefined)).toBe(false);
      expect(StatsValue.isJSON(56)).toBe(false);
      expect(StatsValue.isJSON('fjafsd')).toBe(false);
      expect(StatsValue.isJSON(false)).toBe(false);
    });

    it('returns false because asOf is missing', () => {
      const n: unknown = {
        value: -0.3
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });

    it('returns false because asOf is not string', () => {
      const n: unknown = {
        asOf: false,
        value: -0.3
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });

    it('returns false because value is missing', () => {
      const n: unknown = {
        asOf: '2000-01-01'
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });

    it('returns false because value is not number', () => {
      const n: unknown = {
        asOf: '2000-01-01',
        value: null
      };

      expect(StatsValue.isJSON(n)).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();

      const statsValue1: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(5)
      );
      const statsValue2: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid2),
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(5)
      );
      const statsValue3: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf({
          day: 2
        }),
        new MockNumericalValue(0)
      );
      const statsValue4: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(-1)
      );
      const statsValue5: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(1)
      );
      const statsValue6: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf({
          day: 1
        }),
        new MockNumericalValue(5)
      );

      expect(statsValue1.equals(statsValue1)).toBe(true);
      expect(statsValue1.equals(statsValue2)).toBe(false);
      expect(statsValue1.equals(statsValue3)).toBe(false);
      expect(statsValue1.equals(statsValue4)).toBe(false);
      expect(statsValue1.equals(statsValue5)).toBe(false);
      expect(statsValue1.equals(statsValue6)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsValue: StatsValue = StatsValue.of(
        new MockStatsItemID(),
        AsOf.ofString('2000-01-01').get(),
        NumericalValue.of(1)
      );

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
      const statsValue: StatsValue = StatsValue.of(
        StatsItemID.ofString(id).get(),
        AsOf.ofString(asOf).get(),
        NumericalValue.of(value)
      );

      expect(statsValue.toString()).toBe(`${id} ${asOf} ${value}`);
    });
  });
});
