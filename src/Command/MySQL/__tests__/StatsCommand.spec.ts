import sinon, { SinonSpy, SinonStub } from 'sinon';
import { Stats } from '../../../Entity/Stats';
import { StatsItems } from '../../../Entity/StatsItems';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/MockError';
import { MockMySQLError } from '../../../General/MySQL/Mock/MockMySQLError';
import { MockQuery } from '../../../General/MySQL/Mock/MockQuery';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Try } from '../../../General/Try/Try';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { StatsID } from '../../../VO/StatsID';
import { StatsName } from '../../../VO/StatsName';
import { StatsUnit } from '../../../VO/StatsUnit';
import { Term } from '../../../VO/Term';
import { UpdatedAt } from '../../../VO/UpdatedAt';
import { VeauAccountID } from '../../../VO/VeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.of(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty()
      );
      const accountID: VeauAccountID = VeauAccountID.ofString('d5619e72-3233-43a8-9cc8-571e53b2ff87').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsCommand: StatsCommand = StatsCommand.of(query);
      const trial: Try<void, DataSourceError> = await statsCommand.create(stats, accountID);

      expect(stub.withArgs(`INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      UTC_TIMESTAMP()
      );`, {
        statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
        languageID: 1,
        regionID: 2,
        termID: 1,
        veauAccountID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
        name: 'stats name',
        unit: 'stats unit'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.of(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty()
      );
      const accountID: VeauAccountID = VeauAccountID.ofString('d5619e72-3233-43a8-9cc8-571e53b2ff87').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = StatsCommand.of(query);
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
      const stats: Stats = Stats.of(
        StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.of(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty()
      );
      const accountID: VeauAccountID = VeauAccountID.ofString('d5619e72-3233-43a8-9cc8-571e53b2ff87').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockError());

      const statsCommand: StatsCommand = StatsCommand.of(query);
      await expect(statsCommand.create(stats, accountID)).rejects.toThrow(MockError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsCommand: StatsCommand = StatsCommand.of(query);
      const trial: Try<void, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`, {
        statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: StatsID = StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = StatsCommand.of(query);
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
      const statsID: StatsID = StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();

      const query: MockQuery = new MockQuery();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MockError());

      const statsCommand: StatsCommand = StatsCommand.of(query);
      await expect(statsCommand.deleteByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
