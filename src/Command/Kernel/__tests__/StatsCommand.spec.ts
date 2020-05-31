import 'reflect-metadata';

import sinon, { SinonSpy, SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';
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
      stub.resolves(Alive.of<DataSourceError>());

      const statsCommand: StatsCommand = new StatsCommand(mysql);
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.create(stats, accountID);

      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead when Mysql.transact returns Dead<unknown, DataSourceError>', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const stats: MockStats = new MockStats();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.transact = stub;
      stub.resolves(Dead.of<unknown, DataSourceError>(new MySQLError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = new StatsCommand(mysql);
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.create(stats, accountID);

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
  });
});
