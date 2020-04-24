import {
  Alive,
  DataSourceError,
  Dead,
  MockError,
  MockMySQL,
  MySQLError,
  Superposition
} from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { MockStatsItems } from '../../../Entity/Mock/MockStatsItems';
import { Stats, StatsRow } from '../../../Entity/Stats';
import { StatsItems } from '../../../Entity/StatsItems';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Error/StatsError';
import { StatsItemsError } from '../../../Error/StatsItemsError';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsItemQuery } from '../../Mock/MockStatsItemQuery';
import { StatsQuery } from '../StatsQuery';

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
      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsRow> = [
        {
          statsID: statsID.get().get(),
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
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

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
        statsID: statsID.get().get()
      }).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();
      expect(stats.getStatsID().get().get()).toBe(rows[0].statsID);
      expect(stats.getLanguage().getLanguageID().get()).toBe(rows[0].languageID);
      expect(stats.getLanguage().getName().get()).toBe(rows[0].languageName);
      expect(stats.getLanguage().getEnglishName().get()).toBe(rows[0].languageEnglishName);
      expect(stats.getLanguage().getISO639().get()).toBe(rows[0].iso639);
      expect(stats.getRegion().getRegionID().get()).toBe(rows[0].regionID);
      expect(stats.getRegion().getName().get()).toBe(rows[0].regionName);
      expect(stats.getRegion().getISO3166().get()).toBe(rows[0].iso3166);
      expect(stats.getTerm().getID()).toBe(rows[0].termID);
      expect(stats.getName().get()).toBe(rows[0].name);
      expect(stats.getUnit().get()).toBe(rows[0].unit);
      expect(stats.getUpdatedAt().toString()).toBe(rows[0].updatedAt);
      expect(items).toBe(stats.getItems());
    });

    it('returns Dead because of the statsID is malformat', async () => {
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
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError
      ) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because there is no results', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([]);
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when StatsItemQuery throws StatsValuesError', async () => {
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
      stub2.resolves(Dead.of<StatsItems, StatsItemsError | DataSourceError>(new StatsItemsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when StatsItemQuery throws DataSourceError', async () => {
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
      stub2.resolves(Dead.of<StatsItems, StatsItemsError | DataSourceError>(new MySQLError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(mysql, statsItemQuery);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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
