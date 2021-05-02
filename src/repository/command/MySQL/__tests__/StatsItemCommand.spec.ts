import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MockSQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore';
import sinon, { SinonStub } from 'sinon';
import { MockStatsItem } from '../../../../domain/entity/StatsItem/Mock/MockStatsItem';
import { MockStatsItemID } from '../../../../domain/vo/StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../../domain/vo/StatsItem/Mock/MockStatsItemName';
import { MockStatsID } from '../../../../domain/vo/StatsOutline/Mock/MockStatsID';
import { StatsItemCommand } from '../StatsItemCommand';

describe('StatsItemCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsItemCommand.create(statsID, statsItem, seq).terminate();

      expect(stub.withArgs(
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
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();
      const statsItem: MockStatsItem = new MockStatsItem();
      const seq: number = 3109;

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsItemCommand.create(statsID, statsItem, seq).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const uuid: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID).terminate();

      expect(stub.withArgs(
        `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`,
        {
          statsID: uuid.get()
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
