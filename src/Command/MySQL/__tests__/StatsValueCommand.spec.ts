import { DataSourceError, MockError, MockSQL, MySQLError, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { MockNumericalValue } from '../../../VO/NumericalValue/Mock/MockNumericalValue';
import { MockStatsItemID } from '../../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { StatsValue } from '../../../VO/StatsValue/StatsValue';
import { StatsValueCommand } from '../StatsValueCommand';

describe('StatsValueCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const value: number = 9;
      const statsValue: StatsValue = new MockStatsValue({
        asOf: new MockAsOf(),
        value: new MockNumericalValue(value)
      });

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsValueCommand.create(
        new MockStatsItemID(uuid),
        statsValue
      );

      expect(
        stub.withArgs(
          `INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`,
          {
            statsItemID: uuid.get(),
            asOf: '2000-01-01',
            value
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsValue: MockStatsValue = new MockStatsValue();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsValueCommand.create(
        new MockStatsItemID(),
        statsValue
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const statsValue: MockStatsValue = new MockStatsValue();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      await expect(statsValueCommand.create(new MockStatsItemID(), statsValue)).rejects.toThrow(MockError);
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
      const superposition: Superposition<unknown, DataSourceError> = await statsValueCommand.deleteByStatsID(statsID);

      expect(
        stub.withArgs(
          `DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`,
          {
            statsID: uuid.get()
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsValueCommand.deleteByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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
