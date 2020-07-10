import 'reflect-metadata';

import sinon, { SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MockMySQL, MySQLError } from '@jamashita/publikum-mysql';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { MockStats } from '../../../Entity/Stats/Mock/MockStats';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsCommand1: StatsCommand = kernel.get<StatsCommand>(Type.StatsKernelCommand);
      const statsCommand2: StatsCommand = kernel.get<StatsCommand>(Type.StatsKernelCommand);

      expect(statsCommand1).toBeInstanceOf(StatsCommand);
      expect(statsCommand1).toBe(statsCommand2);
    });
  });

  describe('create', () => {
    it('normal case', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.transact = stub;
      stub.resolves(Superposition.alive<unknown, MySQLError>(null, MySQLError));

      const statsCommand: StatsCommand = new StatsCommand(mysql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand
        .create(stats, accountID)
        .terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead when Mysql.transact returns Dead<unknown, DataSourceError>', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.transact = stub;
      stub.resolves(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const statsCommand: StatsCommand = new StatsCommand(mysql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand
        .create(stats, accountID)
        .terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
