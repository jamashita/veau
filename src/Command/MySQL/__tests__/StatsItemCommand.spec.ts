import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockStatsItem } from '../../../Entity/Mock/MockStatsItem';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/Mock/MockError';
import { MockSQL } from '../../../General/MySQL/Mock/MockSQL';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Try } from '../../../General/Superposition/Try';
import { UUID } from '../../../General/UUID/UUID';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsItemID } from '../../../VO/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/Mock/MockStatsItemName';
import { StatsItemCommand } from '../StatsItemCommand';

// DONE
describe('StatsItemCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
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
      const trial: Try<void, DataSourceError> = await statsItemCommand.create(statsID, statsItem, seq);

      expect(stub.withArgs(`INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`, {
        statsItemID: uuid2.get(),
        statsID: uuid1.get(),
        name: itemName,
        seq
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const statsItem: MockStatsItem = new MockStatsItem();
      const seq: number = 3109;

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const trial: Try<void, DataSourceError> = await statsItemCommand.create(statsID, statsItem, seq);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const statsItem: MockStatsItem = new MockStatsItem();
      const seq: number = 3109;

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      await expect(statsItemCommand.create(statsID, statsItem, seq)).rejects.toThrow(MockError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const trial: Try<void, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: uuid.get()
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      const trial: Try<void, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsItemCommand: StatsItemCommand = new StatsItemCommand(sql);
      await expect(statsItemCommand.deleteByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
