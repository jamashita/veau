import sinon, { SinonSpy } from 'sinon';
import { StatsValueError } from '../../Error/StatsValueError';
import { Try } from '../../General/Try/Try';
import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { StatsItemID } from '../StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';
import { UUID } from '../../General/UUID/UUID';
import { MockStatsItemID } from '../Mock/MockStatsItemID';
import { MockAsOf } from '../Mock/MockAsOf';
import { MockNumericalValue } from '../Mock/MockNumericalValue';

describe('StatsValue', () => {
  describe('ofJSON', () => {
    it('normal case', () => {
      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const json: StatsValueJSON = {
        asOf: '2000-01-01',
        value: -1.1
      };

      const trial: Try<StatsValue, StatsValueError> = StatsValue.ofJSON(StatsItemID.ofString(id).get(), json);

      expect(trial.isSuccess()).toEqual(true);
      const statsValue: StatsValue = trial.get();
      expect(statsValue.getStatsItemID().get().get()).toEqual(id);
      expect(statsValue.getAsOf().toString()).toEqual(json.asOf);
      expect(statsValue.getValue().get()).toEqual(json.value);
    });

    it('asOf is malformat', () => {
      const json: StatsValueJSON = {
        asOf: 'illegal datetime',
        value: -1.1
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsValue, StatsValueError> = StatsValue.ofJSON(StatsItemID.ofString('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(), json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValueError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValueError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: '2000-01-01',
        value: -1.1
      };

      const trial: Try<StatsValue, StatsValueError> = StatsValue.ofRow(row);

      expect(trial.isSuccess()).toEqual(true);
      const statsValue: StatsValue = trial.get();
      expect(statsValue.getStatsItemID().get().get()).toEqual(row.statsItemID);
      expect(statsValue.getAsOf().toString()).toEqual(row.asOf);
      expect(statsValue.getValue().get()).toEqual(row.value);
    });

    it('statsItemID is malformat', () => {
      const row: StatsValueRow = {
        statsItemID: 'illegal uuid',
        asOf: '2000-01-01',
        value: -1.1
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsValue, StatsValueError> = StatsValue.ofRow(row);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValueError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValueError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('asOf is malformat', () => {
      const row: StatsValueRow = {
        statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
        asOf: 'illegal asOf format',
        value: -1.1
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsValue, StatsValueError> = StatsValue.ofRow(row);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValueError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValueError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        asOf: '2000-01-01',
        value: 1
      };

      expect(StatsValue.isJSON(n)).toEqual(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsValue.isJSON(null)).toEqual(false);
      expect(StatsValue.isJSON(undefined)).toEqual(false);
      expect(StatsValue.isJSON(56)).toEqual(false);
      expect(StatsValue.isJSON('fjafsd')).toEqual(false);
      expect(StatsValue.isJSON(false)).toEqual(false);
    });

    it('returns false because asOf is missing', () => {
      const n: unknown = {
        value: -0.3
      };

      expect(StatsValue.isJSON(n)).toEqual(false);
    });

    it('returns false because asOf is not string', () => {
      const n: unknown = {
        asOf: false,
        value: -0.3,
      };

      expect(StatsValue.isJSON(n)).toEqual(false);
    });

    it('returns false because value is missing', () => {
      const n: unknown = {
        asOf: '2000-01-01',
      };

      expect(StatsValue.isJSON(n)).toEqual(false);
    });

    it('returns false because value is not number', () => {
      const n: unknown = {
        asOf: '2000-01-01',
        value: null
      };

      expect(StatsValue.isJSON(n)).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();

      const statsValue1: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf(),
        new MockNumericalValue()
      );
      const statsValue2: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid2),
        new MockAsOf(),
        new MockNumericalValue()
      );
      const statsValue3: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf({
          day: 2
        }),
        NumericalValue.of(0)
      );
      const statsValue4: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf(),
        new MockNumericalValue(-1)
      );
      const statsValue5: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf(),
        new MockNumericalValue(1)
      );
      const statsValue6: StatsValue = StatsValue.of(
        new MockStatsItemID(uuid1),
        new MockAsOf(),
        new MockNumericalValue()
      );

      expect(statsValue1.equals(statsValue1)).toEqual(true);
      expect(statsValue1.equals(statsValue2)).toEqual(false);
      expect(statsValue1.equals(statsValue3)).toEqual(false);
      expect(statsValue1.equals(statsValue4)).toEqual(false);
      expect(statsValue1.equals(statsValue5)).toEqual(false);
      expect(statsValue1.equals(statsValue6)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsValue: StatsValue = StatsValue.of(
        StatsItemID.ofString('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get(),
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
      const statsValue: StatsValue = StatsValue.of(StatsItemID.ofString(id).get(), AsOf.ofString(asOf).get(), NumericalValue.of(value));

      expect(statsValue.toString()).toEqual(`${id} ${asOf} ${value}`);
    });
  });
});
