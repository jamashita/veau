import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockStatsCommand } from '../../Command/Mock/MockStatsCommand';
import { MockStatsItemCommand } from '../../Command/Mock/MockStatsItemCommand';
import { MockStatsValueCommand } from '../../Command/Mock/MockStatsValueCommand';
import { MockStats } from '../../Entity/Mock/MockStats';
import { MockStatsItem } from '../../Entity/Mock/MockStatsItem';
import { MockStatsItems } from '../../Entity/Mock/MockStatsItems';
import { MockStatsUpdateFactory } from '../../Factory/Mock/MockStatsUpdateFactory';
import { DataSourceError } from '../../General/DataSourceError';
import { MockSQL } from '../../General/MySQL/Mock/MockSQL';
import { MySQLError } from '../../General/MySQL/MySQLError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Try } from '../../General/Superposition/Try';
import { MockStatsValue } from '../../VO/Mock/MockStatsValue';
import { MockStatsValues } from '../../VO/Mock/MockStatsValues';
import { MockVeauAccountID } from '../../VO/Mock/MockVeauAccountID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { StatsUpdateTransaction } from '../StatsUpdateTransaction';

// DONE
describe('StatsUpdateTransaction', () => {
  describe('with', () => {
    it('normal case', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Success.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Success.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Success.of<DataSourceError>());
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Success.of<DataSourceError>());
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Success.of<DataSourceError>());

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
      const trial: Try<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(trial.isSuccess()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(stub4.callCount).toEqual(1);
      expect(stub5.callCount).toEqual(2);
      expect(stub6.callCount).toEqual(5);
    });

    it('StatsCommand.deleteByStatsID() returns Failure', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Failure.of<DataSourceError>(new MySQLError('test failed')));
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Success.of<DataSourceError>());
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
      const trial: Try<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('StatsItemCommand.deleteByStatsID() returns Failure', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Success.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Failure.of<DataSourceError>(new MySQLError('test failed')));
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Success.of<DataSourceError>());
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
      const trial: Try<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('StatsValueCommand.deleteByStatsID() returns Failure', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Success.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Failure.of<DataSourceError>(new MySQLError('test failed')));
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
      const trial: Try<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('StatsCommand.create() returns Failure', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Success.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Success.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Failure.of<DataSourceError>(new MySQLError('test failed')));
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Success.of<DataSourceError>());
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Success.of<DataSourceError>());
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
      const trial: Try<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(stub4.called).toEqual(true);
      expect(stub5.called).toEqual(true);
      expect(stub6.called).toEqual(true);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('StatsItemCommand.create() returns Failure', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Success.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Success.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Success.of<DataSourceError>());
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Failure.of<DataSourceError>(new MySQLError('test failed')));
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Success.of<DataSourceError>());
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
      const trial: Try<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(stub4.called).toEqual(true);
      expect(stub5.called).toEqual(true);
      expect(stub6.called).toEqual(true);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('StatsValueCommand.create() returns Failure', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const stub1: SinonStub = sinon.stub();
      statsCommand.deleteByStatsID = stub1;
      stub1.resolves(Success.of<DataSourceError>());
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const stub2: SinonStub = sinon.stub();
      statsItemCommand.deleteByStatsID = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const stub3: SinonStub = sinon.stub();
      statsValueCommand.deleteByStatsID = stub3;
      stub3.resolves(Success.of<DataSourceError>());
      const stub4: SinonStub = sinon.stub();
      statsCommand.create = stub4;
      stub4.resolves(Success.of<DataSourceError>());
      const stub5: SinonStub = sinon.stub();
      statsItemCommand.create = stub5;
      stub5.resolves(Success.of<DataSourceError>());
      const stub6: SinonStub = sinon.stub();
      statsValueCommand.create = stub6;
      stub6.resolves(Failure.of<DataSourceError>(new MySQLError('test failed')));
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
      const trial: Try<unknown, DataSourceError> = await statsUpdateTransaction.with(sql);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(stub4.called).toEqual(true);
      expect(stub5.called).toEqual(true);
      expect(stub6.called).toEqual(true);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
