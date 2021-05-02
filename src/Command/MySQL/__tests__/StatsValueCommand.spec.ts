import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MockSQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore';
import sinon, { SinonStub } from 'sinon';
import { MockAsOf } from '../../../domain/vo/AsOf/Mock/MockAsOf';
import { NumericalValue } from '../../../domain/vo/NumericalValue/NumericalValue';
import { MockStatsItemID } from '../../../domain/vo/StatsItem/Mock/MockStatsItemID';
import { MockStatsID } from '../../../domain/vo/StatsOutline/Mock/MockStatsID';
import { MockStatsValue } from '../../../domain/vo/StatsValue/Mock/MockStatsValue';
import { StatsValue } from '../../../domain/vo/StatsValue/StatsValue';
import { StatsValueCommand } from '../StatsValueCommand';

describe('StatsValueCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const uuid: UUID = UUID.v4();
      const value: number = 9;
      const statsValue: StatsValue = new MockStatsValue({
        asOf: new MockAsOf(),
        value: NumericalValue.of(value)
      });

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsValueCommand.create(new MockStatsItemID(uuid), statsValue).terminate();

      expect(stub.withArgs(
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
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const statsValue: MockStatsValue = new MockStatsValue({
        value: NumericalValue.of(0)
      });

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsValueCommand.create(new MockStatsItemID(), statsValue).terminate();

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

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsValueCommand.deleteByStatsID(statsID).terminate();

      expect(stub.withArgs(
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

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const schrodigner: Schrodinger<unknown, DataSourceError> = await statsValueCommand.deleteByStatsID(statsID).terminate();

      expect(schrodigner.isDead()).toBe(true);
      expect(() => {
        schrodigner.get();
      }).toThrow(MySQLError);
    });
  });
});
