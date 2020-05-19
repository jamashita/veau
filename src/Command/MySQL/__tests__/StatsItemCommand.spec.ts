import { DataSourceError, MockError, MockSQL, MySQLError, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { MockStatsItem } from '../../../Entity/Mock/MockStatsItem';
import { MockStatsItemID } from '../../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { StatsItemCommand } from '../StatsItemCommand';

describe('StatsItemCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid1);
      const itemName: string = 'stats item name';
      const seq: number = 3109;
      const statsItem: MockStatsItem = new MockStatsItem({
        statsItemID: new MockStatsItemID(uuid2),
        name: new MockStatsItemName(itemName)
      });

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsItemCommand.create(
        statsID,
        statsItem,
        seq
      );

      expect(
        stub.withArgs(
          `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`,
          {
            statsItemID: uuid2.get(),
            statsID: uuid1.get(),
            name: itemName,
            seq
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const statsItem: MockStatsItem = new MockStatsItem();
      const seq: number = 3109;

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsItemCommand.create(
        statsID,
        statsItem,
        seq
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
      const statsID: MockStatsID = new MockStatsID();
      const statsItem: MockStatsItem = new MockStatsItem();
      const seq: number = 3109;

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      await expect(statsItemCommand.create(statsID, statsItem, seq)).rejects.toThrow(MockError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID);

      expect(
        stub.withArgs(
          `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`,
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

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID);

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

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      await expect(statsItemCommand.deleteByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
