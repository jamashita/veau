import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { Stats, StatsRow } from '../../../Entity/Stats';
import { StatsItem } from '../../../Entity/StatsItem';
import { StatsItems } from '../../../Entity/StatsItems';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Error/StatsError';
import { StatsItemsError } from '../../../Error/StatsItemsError';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/MockError';
import { MockMySQL } from '../../../General/MySQL/Mock/MockMySQL';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Failure } from '../../../General/Try/Failure';
import { Success } from '../../../General/Try/Success';
import { Try } from '../../../General/Try/Try';
import { StatsValue } from '../../../VO/StatsValue';
import { MockStatsItemQuery } from '../../Mock/MockStatsItemQuery';
import { StatsQuery } from '../StatsQuery';
import { UUID } from '../../../General/UUID/UUID';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsItemID } from '../../../VO/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/Mock/MockStatsItemName';
import { MockStatsValues } from '../../../VO/Mock/MockStatsValues';
import { MockAsOf } from '../../../VO/Mock/MockAsOf';
import { MockNumericalValue } from '../../../VO/Mock/MockNumericalValue';
import { MockStatsItems } from '../../../Entity/Mock/MockStatsItems';

// DONE
describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsMySQLQuery);
      const statsQuery2: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsMySQLQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid1);
      const itemName1: string = 'item name 1';
      const itemName2: string = 'item name 2';
      const itemName3: string = 'item name 3';
      const rows: Array<StatsRow> = [
        {
          statsID: uuid1.get(),
          languageID: 1,
          languageName: 'language1',
          languageEnglishName: 'englishLanguage1',
          iso639: 'lang1',
          regionID: 2,
          regionName: 'region1',
          iso3166: 'regn1',
          termID: 3,
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];
      const items: StatsItems = StatsItems.ofArray([
        StatsItem.of(
          new MockStatsItemID(uuid2),
          new MockStatsItemName(itemName1),
          new MockStatsValues(
            StatsValue.of(
              new MockStatsItemID(uuid2),
              new MockAsOf({
                day: 1
              }),
              new MockNumericalValue(1)
            ),
            StatsValue.of(
              new MockStatsItemID(uuid2),
              new MockAsOf({
                day: 2
              }),
              new MockNumericalValue(2)
            ),
            StatsValue.of(
              new MockStatsItemID(uuid2),
              new MockAsOf({
                day: 3
              }),
              new MockNumericalValue(3)
            )
          )
        ),
        StatsItem.of(
          new MockStatsItemID(uuid3),
          new MockStatsItemName(itemName2),
          new MockStatsValues(
            StatsValue.of(
              new MockStatsItemID(uuid3),
              new MockAsOf({
                day: 1
              }),
              new MockNumericalValue(11)
            ),
            StatsValue.of(
              new MockStatsItemID(uuid3),
              new MockAsOf({
                day: 12
              }),
              new MockNumericalValue(12)
            )
          )
        ),
        StatsItem.of(
          new MockStatsItemID(uuid4),
          new MockStatsItemName(itemName3),
          new MockStatsValues()
        )
      ]);

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Success.of<StatsItems, StatsItemsError | DataSourceError>(items));

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const trial: Try<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(stub1.withArgs(`SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.term_id AS termID,
      R2.name AS languageName,
      R2.english_name AS languageEnglishName,
      R2.iso639,
      R1.region_id AS regionID,
      R3.name AS regionName,
      R3.iso3166,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.stats_id = :statsID;`, {
        statsID: uuid1.get()
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const stats: Stats = trial.get();
      expect(stats.getStatsID().get().get()).toEqual(rows[0].statsID);
      expect(stats.getLanguage().getLanguageID().get()).toEqual(rows[0].languageID);
      expect(stats.getLanguage().getName().get()).toEqual(rows[0].languageName);
      expect(stats.getLanguage().getEnglishName().get()).toEqual(rows[0].languageEnglishName);
      expect(stats.getLanguage().getISO639().get()).toEqual(rows[0].iso639);
      expect(stats.getRegion().getRegionID().get()).toEqual(rows[0].regionID);
      expect(stats.getRegion().getName().get()).toEqual(rows[0].regionName);
      expect(stats.getRegion().getISO3166().get()).toEqual(rows[0].iso3166);
      expect(stats.getTerm().getID()).toEqual(rows[0].termID);
      expect(stats.getName().get()).toEqual(rows[0].name);
      expect(stats.getUnit().get()).toEqual(rows[0].unit);
      expect(stats.getUpdatedAt().toString()).toEqual(rows[0].updatedAt);
      expect(items).toEqual(stats.getItems());
    });

    it('returns Failure because of the statsID is malformat', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsRow> = [
        {
          statsID: 'malformat uuid',
          languageID: 1,
          languageName: 'language1',
          languageEnglishName: 'englishLanguage1',
          iso639: 'lang1',
          regionID: 2,
          regionName: 'region1',
          iso3166: 'regn1',
          termID: 3,
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];
      const items: MockStatsItems = new MockStatsItems();

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Success.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const trial: Try<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError
      ) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because there is no results', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([]);
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const trial: Try<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when StatsItemQuery throws StatsValuesError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsRow> = [
        {
          statsID: 'a25a8b7f-c810-4dc0-b94e-e97e74329307',
          languageID: 1,
          languageName: 'language1',
          languageEnglishName: 'englishLanguage1',
          iso639: 'lang1',
          regionID: 2,
          regionName: 'region1',
          iso3166: 'regn1',
          termID: 3,
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Failure.of<StatsItems, StatsItemsError | DataSourceError>(new StatsItemsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const trial: Try<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when StatsItemQuery throws DataSourceError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsRow> = [
        {
          statsID: 'a25a8b7f-c810-4dc0-b94e-e97e74329307',
          languageID: 1,
          languageName: 'language1',
          languageEnglishName: 'englishLanguage1',
          iso639: 'lang1',
          regionID: 2,
          regionName: 'region1',
          iso3166: 'regn1',
          termID: 3,
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Failure.of<StatsItems, StatsItemsError | DataSourceError>(new MySQLError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const trial: Try<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockError());
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      await expect(statsQuery.findByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
