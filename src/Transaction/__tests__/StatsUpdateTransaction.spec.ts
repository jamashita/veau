import { Alive, DataSourceError, Dead, MockSQL, MySQLError, Superposition } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

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

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Alive.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Alive.of<DataSourceError>());
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Alive.of<DataSourceError>());
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Alive.of<DataSourceError>());

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
      const superposition: Superposition<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(superposition.isAlive()).toBe(true);
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

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Dead.of<DataSourceError>(new MySQLError('test failed')));
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Alive.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const superposition: Superposition<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

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

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Dead.of<DataSourceError>(new MySQLError('test failed')));
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Alive.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const superposition: Superposition<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

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

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Dead.of<DataSourceError>(new MySQLError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const superposition: Superposition<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

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

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Alive.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Dead.of<DataSourceError>(new MySQLError('test failed')));
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Alive.of<DataSourceError>());
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Alive.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const superposition: Superposition<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

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

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(stub4.called).toBe(true);
      expect(stub5.called).toBe(true);
      expect(stub6.called).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Alive.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Alive.of<DataSourceError>());
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Dead.of<DataSourceError>(new MySQLError('test failed')));
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Alive.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const superposition: Superposition<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

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

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(stub4.called).toBe(true);
      expect(stub5.called).toBe(true);
      expect(stub6.called).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Alive.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Alive.of<DataSourceError>());
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Alive.of<DataSourceError>());
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Dead.of<DataSourceError>(new MySQLError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const superposition: Superposition<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

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

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(stub4.called).toBe(true);
      expect(stub5.called).toBe(true);
      expect(stub6.called).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
