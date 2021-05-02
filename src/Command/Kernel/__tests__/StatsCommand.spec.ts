import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { MockStats } from '../../../domain/Entity/Stats/Mock/MockStats';
import { MockVeauAccountID } from '../../../domain/VO/VeauAccount/Mock/MockVeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsCommand1: StatsCommand = kernel.get<StatsCommand>(Type.StatsKernelCommand);
      const statsCommand2: StatsCommand = kernel.get<StatsCommand>(Type.StatsKernelCommand);

      expect(statsCommand1).toBeInstanceOf(StatsCommand);
      expect(statsCommand1).toBe(statsCommand2);
    });
  });

  describe('create', () => {
    it('normal case', async () => {
      expect.assertions(1);

      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.transact = stub;
      stub.resolves(Superposition.alive<unknown, MySQLError>(null, MySQLError));

      const statsCommand: StatsCommand = new StatsCommand(mysql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.create(stats, accountID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead when Mysql.transact returns Dead<unknown, DataSourceError>', async () => {
      expect.assertions(2);

      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.transact = stub;
      stub.resolves(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const statsCommand: StatsCommand = new StatsCommand(mysql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.create(stats, accountID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
