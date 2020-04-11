import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { Stats, StatsRow } from '../../../veau-entity/Stats';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { StatsItems } from '../../../veau-entity/StatsItems';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { StatsError } from '../../../veau-error/StatsError';
import { StatsItemsError } from '../../../veau-error/StatsItemsError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockError } from '../../../veau-general/MockError';
import { MockMySQL } from '../../../veau-general/MySQL/mocks/MockMySQL';
import { MockMySQLError } from '../../../veau-general/MySQL/mocks/MockMySQLError';
import { MySQLError } from '../../../veau-general/MySQL/MySQLError';
import { Failure } from '../../../veau-general/Try/Failure';
import { Success } from '../../../veau-general/Try/Success';
import { Try } from '../../../veau-general/Try/Try';
import { AsOf } from '../../../veau-vo/AsOf';
import { NumericalValue } from '../../../veau-vo/NumericalValue';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsItemID } from '../../../veau-vo/StatsItemID';
import { StatsItemName } from '../../../veau-vo/StatsItemName';
import { StatsValue } from '../../../veau-vo/StatsValue';
import { StatsValues } from '../../../veau-vo/StatsValues';
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
      const statsID: StatsID = StatsID.ofString('a25a8b7f-c810-4dc0-b94e-e97e74329307').get();
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
      const items: StatsItems = StatsItems.ofArray([
        StatsItem.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          StatsItemName.of('name1'),
          StatsValues.ofArray([
            StatsValue.of(
              StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
              AsOf.ofString('2000-01-01').get(),
              NumericalValue.of(1)
            ),
            StatsValue.of(
              StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
              AsOf.ofString('2000-01-02').get(),
              NumericalValue.of(2)
            ),
            StatsValue.of(
              StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
              AsOf.ofString('2000-01-03').get(),
              NumericalValue.of(3)
            )
          ])
        ),
        StatsItem.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          StatsItemName.of('name2'),
          StatsValues.ofArray([
            StatsValue.of(
              StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
              AsOf.ofString('2001-01-01').get(),
              NumericalValue.of(11)
            ),
            StatsValue.of(
              StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
              AsOf.ofString('2001-01-02').get(),
              NumericalValue.of(12)
            )
          ])
        ),
        StatsItem.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          StatsItemName.of('name2'),
          StatsValues.ofArray([])
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
        statsID: 'a25a8b7f-c810-4dc0-b94e-e97e74329307'
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
      const statsID: StatsID = StatsID.ofString('a25a8b7f-c810-4dc0-b94e-e97e74329307').get();
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
      const items: StatsItems = StatsItems.ofArray([
        StatsItem.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          StatsItemName.of('name1'),
          StatsValues.ofArray([
            StatsValue.of(
              StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
              AsOf.ofString('2000-01-01').get(),
              NumericalValue.of(1)
            ),
            StatsValue.of(
              StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
              AsOf.ofString('2000-01-02').get(),
              NumericalValue.of(2)
            ),
            StatsValue.of(
              StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
              AsOf.ofString('2000-01-03').get(),
              NumericalValue.of(3)
            )
          ])
        ),
        StatsItem.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          StatsItemName.of('name2'),
          StatsValues.ofArray([
            StatsValue.of(
              StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
              AsOf.ofString('2001-01-01').get(),
              NumericalValue.of(11)
            ),
            StatsValue.of(
              StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
              AsOf.ofString('2001-01-02').get(),
              NumericalValue.of(12)
            )
          ])
        ),
        StatsItem.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          StatsItemName.of('name2'),
          StatsValues.ofArray([])
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
      const statsID: StatsID = StatsID.ofString('a25a8b7f-c810-4dc0-b94e-e97e74329307').get();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([
      ]);
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
      const statsID: StatsID = StatsID.ofString('a25a8b7f-c810-4dc0-b94e-e97e74329307').get();
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
      const statsID: StatsID = StatsID.ofString('a25a8b7f-c810-4dc0-b94e-e97e74329307').get();
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
      stub2.resolves(Failure.of<StatsItems, StatsItemsError | DataSourceError>(new MockMySQLError()));
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
      const statsID: StatsID = StatsID.ofString('a25a8b7f-c810-4dc0-b94e-e97e74329307').get();

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
