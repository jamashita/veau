import sinon, { SinonSpy, SinonStub } from 'sinon';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/Mock/MockError';
import { MockSQL } from '../../../General/MySQL/Mock/MockSQL';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Try } from '../../../General/Try/Try';
import { UUID } from '../../../General/UUID/UUID';
import { MockAsOf } from '../../../VO/Mock/MockAsOf';
import { MockNumericalValue } from '../../../VO/Mock/MockNumericalValue';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsItemID } from '../../../VO/Mock/MockStatsItemID';
import { MockStatsValue } from '../../../VO/Mock/MockStatsValue';
import { StatsValue } from '../../../VO/StatsValue';
import { StatsValueCommand } from '../StatsValueCommand';

// DONE
describe('StatsValueCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const value: number = 9;
      const statsValue: StatsValue = new MockStatsValue({
        statsItemID: new MockStatsItemID(uuid),
        asOf: new MockAsOf(),
        value: new MockNumericalValue(value)
      });

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const trial: Try<void, DataSourceError> = await statsValueCommand.create(statsValue);

      expect(stub.withArgs(`INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`, {
        statsItemID: uuid.get(),
        asOf: '2000-01-01',
        value
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsValue: MockStatsValue = new MockStatsValue();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const trial: Try<void, DataSourceError> = await statsValueCommand.create(statsValue);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsValue: MockStatsValue = new MockStatsValue();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      await expect(statsValueCommand.create(statsValue)).rejects.toThrow(MockError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const trial: Try<void, DataSourceError> = await statsValueCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`, {
        statsID: uuid.get()
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const trial: Try<void, DataSourceError> = await statsValueCommand.deleteByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      await expect(statsValueCommand.deleteByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
