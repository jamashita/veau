import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { IQuery } from '../../../veau-general/MySQL/IQuery';
import { MockMySQLError } from '../../../veau-general/MySQL/MockMySQLError';
import { MockQuery } from '../../../veau-general/MySQL/MockQuery';
import { MySQLError } from '../../../veau-general/MySQL/MySQLError';
import { Try } from '../../../veau-general/Try/Try';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsItemID } from '../../../veau-vo/StatsItemID';
import { StatsItemName } from '../../../veau-vo/StatsItemName';
import { StatsValues } from '../../../veau-vo/StatsValues';
import { StatsItemCommand } from '../StatsItemCommand';

describe('StatsItemCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const statsItem: StatsItem = StatsItem.of(
        StatsItemID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        StatsItemName.of('stats item name'),
        StatsValues.empty()
      );

      const query: IQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      const trial: Try<void, MySQLError> = await statsItemCommand.create(statsID, statsItem, 1);

      expect(stub.withArgs(`INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`, {
        statsItemID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
        statsID: '59915b56-b930-426c-a146-3b1dde8054cd',
        name: 'stats item name',
        seq: 1
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MysqlError', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const statsItem: StatsItem = StatsItem.of(
        StatsItemID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        StatsItemName.of('stats item name'),
        StatsValues.empty()
      );

      const query: IQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      const trial: Try<void, MySQLError> = await statsItemCommand.create(statsID, statsItem, 1);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const statsItem: StatsItem = StatsItem.of(
        StatsItemID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        StatsItemName.of('stats item name'),
        StatsValues.empty()
      );
      const error: Error = new Error();

      const query: IQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(error);

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      try {
        await statsItemCommand.create(statsID, statsItem, 1);
      } catch (err) {
        expect(err).toBe(error);
      }
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();

      const query: IQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      const trial: Try<void, MySQLError> = await statsItemCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: '59915b56-b930-426c-a146-3b1dde8054cd'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MysqlError', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();

      const query: IQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      const trial: Try<void, MySQLError> = await statsItemCommand.deleteByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const error: Error = new Error();

      const query: IQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(error);

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      try {
        await statsItemCommand.deleteByStatsID(statsID);
      }
      catch (err) {
        expect(err).toBe(error);
      }
    });
  });
});
