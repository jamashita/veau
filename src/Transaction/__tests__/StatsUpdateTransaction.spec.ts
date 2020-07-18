import sinon, { SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MockSQL, MySQLError } from '@jamashita/publikum-mysql';

import { MockStatsCommand } from '../../Command/Mock/MockStatsCommand';
import { MockStatsItemCommand } from '../../Command/Mock/MockStatsItemCommand';
import { MockStatsValueCommand } from '../../Command/Mock/MockStatsValueCommand';
import { MockStats } from '../../Entity/Stats/Mock/MockStats';
import { MockStatsItem } from '../../Entity/StatsItem/Mock/MockStatsItem';
import { MockStatsItems } from '../../Entity/StatsItem/Mock/MockStatsItems';
import { MockStatsUpdateFactory } from '../../Factory/Mock/MockStatsUpdateFactory';
import { MockAsOf } from '../../VO/AsOf/Mock/MockAsOf';
import { MockStatsItemID } from '../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsValue } from '../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../VO/StatsValue/Mock/MockStatsValues';
import { MockVeauAccountID } from '../../VO/VeauAccount/Mock/MockVeauAccountID';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { StatsUpdateTransaction } from '../StatsUpdateTransaction';

describe('StatsUpdateTransaction', () => {
  describe('with', () => {
    it('normal case', async () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            statsItemID: statsItemID1,
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  day: 2
                })
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  day: 3
                })
              })
            )
          }),
          new MockStatsItem({
            statsItemID: statsItemID2,
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  day: 4
                })
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  day: 2
                })
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  day: 3
                })
              })
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand<MySQLError> = new MockStatsCommand<MySQLError>();
      const stub1: SinonStub = sinon.stub();

      statsCommand.deleteByStatsID = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsItemCommand: MockStatsItemCommand<MySQLError> = new MockStatsItemCommand<MySQLError>();
      const stub2: SinonStub = sinon.stub();

      statsItemCommand.deleteByStatsID = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsValueCommand: MockStatsValueCommand<MySQLError> = new MockStatsValueCommand<MySQLError>();
      const stub3: SinonStub = sinon.stub();

      statsValueCommand.deleteByStatsID = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub4: SinonStub = sinon.stub();

      statsCommand.create = stub4;
      stub4.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub5: SinonStub = sinon.stub();

      statsItemCommand.create = stub5;
      stub5.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub6: SinonStub = sinon.stub();

      statsValueCommand.create = stub6;
      stub6.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const sql: MockSQL = new MockSQL();
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(schrodinger.isAlive()).toBe(true);
      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(stub4.callCount).toBe(1);
      expect(stub5.callCount).toBe(2);
      expect(stub6.callCount).toBe(5);
    });

    it('StatsCommand.deleteByStatsID() returns Dead', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand<MySQLError> = new MockStatsCommand<MySQLError>();
      const stub1: SinonStub = sinon.stub();

      statsCommand.deleteByStatsID = stub1;
      stub1.returns(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const statsItemCommand: MockStatsItemCommand<MySQLError> = new MockStatsItemCommand<MySQLError>();
      const stub2: SinonStub = sinon.stub();

      statsItemCommand.deleteByStatsID = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsValueCommand: MockStatsValueCommand<MySQLError> = new MockStatsValueCommand<MySQLError>();
      const stub3: SinonStub = sinon.stub();

      statsValueCommand.deleteByStatsID = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const sql: MockSQL = new MockSQL();
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
    });

    it('StatsItemCommand.deleteByStatsID() returns Dead', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand<MySQLError> = new MockStatsCommand<MySQLError>();
      const stub1: SinonStub = sinon.stub();

      statsCommand.deleteByStatsID = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsItemCommand: MockStatsItemCommand<MySQLError> = new MockStatsItemCommand<MySQLError>();
      const stub2: SinonStub = sinon.stub();

      statsItemCommand.deleteByStatsID = stub2;
      stub2.returns(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const statsValueCommand: MockStatsValueCommand<MySQLError> = new MockStatsValueCommand<MySQLError>();
      const stub3: SinonStub = sinon.stub();

      statsValueCommand.deleteByStatsID = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const sql: MockSQL = new MockSQL();
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
    });

    it('StatsValueCommand.deleteByStatsID() returns Dead', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand<MySQLError> = new MockStatsCommand<MySQLError>();
      const stub1: SinonStub = sinon.stub();

      statsCommand.deleteByStatsID = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsItemCommand: MockStatsItemCommand<MySQLError> = new MockStatsItemCommand<MySQLError>();
      const stub2: SinonStub = sinon.stub();

      statsItemCommand.deleteByStatsID = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsValueCommand: MockStatsValueCommand<MySQLError> = new MockStatsValueCommand<MySQLError>();
      const stub3: SinonStub = sinon.stub();

      statsValueCommand.deleteByStatsID = stub3;
      stub3.returns(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const sql: MockSQL = new MockSQL();
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
    });

    it('StatsCommand.create() returns Dead', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand<MySQLError> = new MockStatsCommand<MySQLError>();
      const stub1: SinonStub = sinon.stub();

      statsCommand.deleteByStatsID = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsItemCommand: MockStatsItemCommand<MySQLError> = new MockStatsItemCommand<MySQLError>();
      const stub2: SinonStub = sinon.stub();

      statsItemCommand.deleteByStatsID = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsValueCommand: MockStatsValueCommand<MySQLError> = new MockStatsValueCommand<MySQLError>();
      const stub3: SinonStub = sinon.stub();

      statsValueCommand.deleteByStatsID = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub4: SinonStub = sinon.stub();

      statsCommand.create = stub4;
      stub4.returns(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const stub5: SinonStub = sinon.stub();

      statsItemCommand.create = stub5;
      stub5.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub6: SinonStub = sinon.stub();

      statsValueCommand.create = stub6;
      stub6.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const sql: MockSQL = new MockSQL();
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(stub4.called).toBe(true);
      expect(stub5.called).toBe(true);
      expect(stub6.called).toBe(true);
    });

    it('StatsItemCommand.create() returns Dead', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand<MySQLError> = new MockStatsCommand<MySQLError>();
      const stub1: SinonStub = sinon.stub();

      statsCommand.deleteByStatsID = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsItemCommand: MockStatsItemCommand<MySQLError> = new MockStatsItemCommand<MySQLError>();
      const stub2: SinonStub = sinon.stub();

      statsItemCommand.deleteByStatsID = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsValueCommand: MockStatsValueCommand<MySQLError> = new MockStatsValueCommand<MySQLError>();
      const stub3: SinonStub = sinon.stub();

      statsValueCommand.deleteByStatsID = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub4: SinonStub = sinon.stub();

      statsCommand.create = stub4;
      stub4.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub5: SinonStub = sinon.stub();

      statsItemCommand.create = stub5;
      stub5.returns(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const stub6: SinonStub = sinon.stub();

      statsValueCommand.create = stub6;
      stub6.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const sql: MockSQL = new MockSQL();
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(stub4.called).toBe(true);
      expect(stub5.called).toBe(true);
      expect(stub6.called).toBe(true);
    });

    it('StatsValueCommand.create() returns Dead', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: new MockStatsValues(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand<MySQLError> = new MockStatsCommand<MySQLError>();
      const stub1: SinonStub = sinon.stub();

      statsCommand.deleteByStatsID = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsItemCommand: MockStatsItemCommand<MySQLError> = new MockStatsItemCommand<MySQLError>();
      const stub2: SinonStub = sinon.stub();

      statsItemCommand.deleteByStatsID = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const statsValueCommand: MockStatsValueCommand<MySQLError> = new MockStatsValueCommand<MySQLError>();
      const stub3: SinonStub = sinon.stub();

      statsValueCommand.deleteByStatsID = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub4: SinonStub = sinon.stub();

      statsCommand.create = stub4;
      stub4.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub5: SinonStub = sinon.stub();

      statsItemCommand.create = stub5;
      stub5.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const stub6: SinonStub = sinon.stub();

      statsValueCommand.create = stub6;
      stub6.returns(Superposition.dead<unknown, MySQLError>(new MySQLError('test failed'), MySQLError));

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const sql: MockSQL = new MockSQL();
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(stub4.called).toBe(true);
      expect(stub5.called).toBe(true);
      expect(stub6.called).toBe(true);
    });
  });
});
