import sinon, { SinonSpy, SinonStub } from 'sinon';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/MockError';
import { MockQuery } from '../../../General/MySQL/Mock/MockQuery';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import 'reflect-metadata';
import { Try } from '../../../General/Try/Try';
import { StatsCommand } from '../StatsCommand';
import { UUID } from '../../../General/UUID/UUID';
import { MockStats } from '../../../Entity/Mock/MockStats';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockLanguage } from '../../../VO/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockRegion } from '../../../VO/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockTerm } from '../../../VO/Mock/MockTerm';
import { MockStatsName } from '../../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../../VO/Mock/MockStatsUnit';
import { MockVeauAccountID } from '../../../VO/Mock/MockVeauAccountID';

// DONE
describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const languageID: number = 24;
      const regionID: number = 33;
      const termID: number = 935;
      const statsName: string = 'stats name';
      const statsUnit: string = 'stats unit';
      const stats: MockStats = new MockStats({
        statsID: new MockStatsID(uuid1),
        language: new MockLanguage({
          languageID: new MockLanguageID(languageID)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(regionID)
        }),
        term: new MockTerm({
          id: termID
        }),
        name: new MockStatsName(statsName),
        unit: new MockStatsUnit(statsUnit)
      });
      const accountID: MockVeauAccountID = new MockVeauAccountID(uuid2);

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsCommand: StatsCommand = new StatsCommand(query);
      const trial: Try<void, DataSourceError> = await statsCommand.create(stats, accountID);

      expect(stub.withArgs(`INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      :updatedAt
      );`, {
        statsID: uuid1.get(),
        languageID,
        regionID,
        termID,
        veauAccountID: uuid2.get(),
        name: statsName,
        unit: statsUnit,
        updatedAt: '2000-01-02 01:02:03'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const stats: MockStats = new MockStats();
      const accountID: MockVeauAccountID = new MockVeauAccountID();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = new StatsCommand(query);
      const trial: Try<void, DataSourceError> = await statsCommand.create(stats, accountID);

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
      const stats: MockStats = new MockStats();
      const accountID: MockVeauAccountID = new MockVeauAccountID();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockError());

      const statsCommand: StatsCommand = new StatsCommand(query);
      await expect(statsCommand.create(stats, accountID)).rejects.toThrow(MockError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid);

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsCommand: StatsCommand = new StatsCommand(query);
      const trial: Try<void, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`, {
        statsID: uuid.get()
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = new StatsCommand(query);
      const trial: Try<void, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

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

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockError());

      const statsCommand: StatsCommand = new StatsCommand(query);
      await expect(statsCommand.deleteByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
