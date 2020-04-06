import 'jest';
import { MysqlError } from 'mysql';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItems } from '../../../veau-entity/StatsItems';
import { StatsIDError } from '../../../veau-error/StatsIDError';
import { IQuery } from '../../../veau-general/MySQL/IQuery';
import { MySQLError } from '../../../veau-general/MySQL/MySQLError';
import { QueryMock } from '../../../veau-general/MySQL/QueryMock';
import { None } from '../../../veau-general/Optional/None';
import { Try } from '../../../veau-general/Try/Try';
import { AsOf } from '../../../veau-vo/AsOf';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsName } from '../../../veau-vo/StatsName';
import { StatsUnit } from '../../../veau-vo/StatsUnit';
import { Term } from '../../../veau-vo/Term';
import { UpdatedAt } from '../../../veau-vo/UpdatedAt';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const stats: Stats = Stats.of(
        StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.of(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty(),
        None.of<AsOf>()
      );
      const accountID: VeauAccountID = VeauAccountID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87').get();

      const query: IQuery = new QueryMock();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsCommand: StatsCommand = StatsCommand.of(query);
      const trial: Try<void, MySQLError> = await statsCommand.create(stats, accountID);

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

    it('returns Failure because the client throws MysqlError', async () => {
      const stats: Stats = Stats.of(
        StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.of(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty(),
        None.of<AsOf>()
      );
      const accountID: VeauAccountID = VeauAccountID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87').get();

      const query: IQuery = new QueryMock();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MySQLError(new Error() as MysqlError));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = StatsCommand.of(query);
      const trial: Try<void, MySQLError> = await statsCommand.create(stats, accountID);

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
      const stats: Stats = Stats.of(
        StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.of(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty(),
        None.of<AsOf>()
      );
      const accountID: VeauAccountID = VeauAccountID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87').get();
      const error: Error = new Error();

      const query: IQuery = new QueryMock();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(error);

      const statsCommand: StatsCommand = StatsCommand.of(query);
      try {
        await expect(statsCommand.create(stats, accountID)).rejects.toThrow();
      }
      catch (err) {
        expect(err).toBe(error);
      }
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const statsID: Try<StatsID, StatsIDError> = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');

      const query: IQuery = new QueryMock();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;

      const statsCommand: StatsCommand = StatsCommand.of(query);
      const trial: Try<void, MySQLError> = await statsCommand.deleteByStatsID(statsID.get());

      expect(stub.withArgs(`DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`, {
        statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws MysqlError', async () => {
      const statsID: Try<StatsID, StatsIDError> = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');

      const query: IQuery = new QueryMock();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(new MySQLError(new Error() as MysqlError));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = StatsCommand.of(query);
      const trial: Try<void, MySQLError> = await statsCommand.deleteByStatsID(statsID.get());

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
      const statsID: Try<StatsID, StatsIDError> = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      const error: Error = new Error();

      const query: IQuery = new QueryMock();
      const stub: SinonStub = sinon.stub();
      query.execute = stub;
      stub.rejects(error);

      const statsCommand: StatsCommand = StatsCommand.of(query);
      try {
        await statsCommand.deleteByStatsID(statsID.get());
      }
      catch (err) {
        expect(err).toBe(error);
      }
    });
  });
});
