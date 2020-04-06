import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockMySQLError } from '../../../veau-general/MySQL/mocks/MockMySQLError';
import { MockQuery } from '../../../veau-general/MySQL/mocks/MockQuery';
import { MySQLError } from '../../../veau-general/MySQL/MySQLError';
import { Try } from '../../../veau-general/Try/Try';
import { AsOf } from '../../../veau-vo/AsOf';
import { NumericalValue } from '../../../veau-vo/NumericalValue';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsItemID } from '../../../veau-vo/StatsItemID';
import { StatsValue } from '../../../veau-vo/StatsValue';
import { StatsValueCommand } from '../StatsValueCommand';

describe('StatsValueCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const statsItemID: StatsItemID = StatsItemID.of('6c3f54e0-bfe5-4b4b-9227-2175604ab739').get();
      const statsValue: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);
      const trial: Try<void, MySQLError> = await statsValueCommand.create(statsValue);

      expect(stub.withArgs(`INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`, {
        statsItemID: '6c3f54e0-bfe5-4b4b-9227-2175604ab739',
        asOf: '2000-01-01',
        value: 1
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MysqlError', async () => {
      const statsItemID: StatsItemID = StatsItemID.of('6c3f54e0-bfe5-4b4b-9227-2175604ab739').get();
      const statsValue: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);
      const trial: Try<void, MySQLError> = await statsValueCommand.create(statsValue);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsItemID: StatsItemID = StatsItemID.of('6c3f54e0-bfe5-4b4b-9227-2175604ab739').get();
      const statsValue: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const error: Error = new Error();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(error);

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);
      try {
        await statsValueCommand.create(statsValue);
      }
      catch (err) {
        expect(err).toBe(error);
      }
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);
      const trial: Try<void, MySQLError> = await statsValueCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`, {
        statsID: '59915b56-b930-426c-a146-3b1dde8054cd'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MysqlError', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);
      const trial: Try<void, MySQLError> = await statsValueCommand.deleteByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const error: Error = new Error();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(error);

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);
      try {
        await statsValueCommand.deleteByStatsID(statsID);
      }
      catch (err) {
        expect(err).toBe(error);
      }
    });
  });
});
