import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MockSQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import sinon, { SinonStub } from 'sinon';
import { MockStats } from '../../../../../domain/entity/Stats/mock/MockStats';
import { MockStatsItem } from '../../../../../domain/entity/StatsItem/mock/MockStatsItem';
import { MockStatsItems } from '../../../../../domain/entity/StatsItem/mock/MockStatsItems';
import { MockAsOf } from '../../../../../domain/vo/AsOf/mock/MockAsOf';
import { MockStatsItemID } from '../../../../../domain/vo/StatsItem/mock/MockStatsItemID';
import { MockStatsValue } from '../../../../../domain/vo/StatsValue/mock/MockStatsValue';
import { StatsValues } from '../../../../../domain/vo/StatsValue/StatsValues';
import { MockVeauAccountID } from '../../../../../domain/vo/VeauAccount/mock/MockVeauAccountID';
import { VeauAccountID } from '../../../../../domain/vo/VeauAccount/VeauAccountID';
import { MockStatsUpdateFactory } from '../../../../../factory/mock/MockStatsUpdateFactory';
import { MockStatsCommand } from '../../../mock/MockStatsCommand';
import { MockStatsItemCommand } from '../../../mock/MockStatsItemCommand';
import { MockStatsValueCommand } from '../../../mock/MockStatsValueCommand';
import { StatsUpdateTransaction } from '../StatsUpdateTransaction';

describe('StatsUpdateTransaction', () => {
  describe('with', () => {
    it('normal case', async () => {
      expect.assertions(7);

      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            statsItemID: statsItemID1,
            values: StatsValues.ofSpread(
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
            values: StatsValues.ofSpread(
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

    it('statsCommand.deleteByStatsID() returns Dead', async () => {
      expect.assertions(5);

      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
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

    it('statsItemCommand.deleteByStatsID() returns Dead', async () => {
      expect.assertions(5);

      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
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

    it('statsValueCommand.deleteByStatsID() returns Dead', async () => {
      expect.assertions(5);

      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
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

    it('statsCommand.create() returns Dead', async () => {
      expect.assertions(8);

      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
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

    it('statsItemCommand.create() returns Dead', async () => {
      expect.assertions(8);

      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
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

    it('statsValueCommand.create() returns Dead', async () => {
      expect.assertions(8);

      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue())
          }),
          new MockStatsItem({
            values: StatsValues.ofSpread(new MockStatsValue(), new MockStatsValue(), new MockStatsValue())
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
