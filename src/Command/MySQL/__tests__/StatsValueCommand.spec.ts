import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { MockSQL, MySQLError } from '@jamashita/publikum-mysql';
import { UUID } from '@jamashita/publikum-uuid';
import sinon, { SinonStub } from 'sinon';

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
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsValueCommand
        .create(new MockStatsItemID(uuid), statsValue)
        .terminate();

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
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsValue: MockStatsValue = new MockStatsValue();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsValueCommand
        .create(new MockStatsItemID(), statsValue)
        .terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
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
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsValueCommand
        .deleteByStatsID(statsID)
        .terminate();

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
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));

      const statsValueCommand: StatsValueCommand = new StatsValueCommand(sql);
      const schrodigner: Schrodinger<unknown, DataSourceError> = await statsValueCommand
        .deleteByStatsID(statsID)
        .terminate();

      expect(schrodigner.isDead()).toBe(true);
      expect(() => {
        schrodigner.get();
      }).toThrow(MySQLError);
    });
  });
});
