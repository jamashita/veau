import sinon, { SinonSpy, SinonStub } from 'sinon';
import { StatsItem } from '../../../Entity/StatsItem';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/MockError';
import { MockMySQLError } from '../../../General/MySQL/Mock/MockMySQLError';
import { MockQuery } from '../../../General/MySQL/Mock/MockQuery';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Try } from '../../../General/Try/Try';
import { StatsID } from '../../../VO/StatsID';
import { StatsItemID } from '../../../VO/StatsItemID';
import { StatsItemName } from '../../../VO/StatsItemName';
import { StatsValues } from '../../../VO/StatsValues';
import { StatsItemCommand } from '../StatsItemCommand';

describe('StatsItemCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const statsItem: StatsItem = StatsItem.of(
        StatsItemID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        StatsItemName.of('stats item name'),
        StatsValues.empty()
      );

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      const trial: Try<void, DataSourceError> = await statsItemCommand.create(statsID, statsItem, 1);

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

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: StatsID = StatsID.ofString('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const statsItem: StatsItem = StatsItem.of(
        StatsItemID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        StatsItemName.of('stats item name'),
        StatsValues.empty()
      );

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      const trial: Try<void, DataSourceError> = await statsItemCommand.create(statsID, statsItem, 1);

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
      const statsID: StatsID = StatsID.ofString('59915b56-b930-426c-a146-3b1dde8054cd').get();
      const statsItem: StatsItem = StatsItem.of(
        StatsItemID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        StatsItemName.of('stats item name'),
        StatsValues.empty()
      );

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockError());

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      await expect(statsItemCommand.create(statsID, statsItem, 1)).rejects.toThrow(MockError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('59915b56-b930-426c-a146-3b1dde8054cd').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      const trial: Try<void, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: '59915b56-b930-426c-a146-3b1dde8054cd'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: StatsID = StatsID.ofString('59915b56-b930-426c-a146-3b1dde8054cd').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
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
      const statsID: StatsID = StatsID.ofString('59915b56-b930-426c-a146-3b1dde8054cd').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockError());

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
      await expect(statsItemCommand.deleteByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
