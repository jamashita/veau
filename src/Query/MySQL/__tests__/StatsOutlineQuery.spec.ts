import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { StatsOutlinesError } from '../../../Error/StatsOutlinesError';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/Mock/MockError';
import { MockMySQL } from '../../../General/MySQL/Mock/MockMySQL';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Superposition } from '../../../General/Superposition/Superposition';
import { MockPage } from '../../../VO/Mock/MockPage';
import { MockVeauAccountID } from '../../../VO/Mock/MockVeauAccountID';
import { Page } from '../../../VO/Page';
import { StatsOutline, StatsOutlineRow } from '../../../VO/StatsOutline';
import { StatsOutlines } from '../../../VO/StatsOutlines';
import { VeauAccountID } from '../../../VO/VeauAccountID';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

// DONE
describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsOutlineQuery1: StatsOutlineQuery = kernel.get<StatsOutlineQuery>(TYPE.StatsOutlineMySQLQuery);
      const statsOutlineQuery2: StatsOutlineQuery = kernel.get<StatsOutlineQuery>(TYPE.StatsOutlineMySQLQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage();
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          languageID: 1,
          languageName: 'lang1',
          languageEnglishName: 'lang1',
          iso639: 'l1',
          regionID: 2,
          regionName: 'regn2',
          iso3166: 'r2',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: 'a25a8b7f-c810-4dc0-b94e-e97e74329307',
          languageID: 2,
          languageName: 'lang2',
          languageEnglishName: 'lang2',
          iso639: 'l2',
          regionID: 3,
          regionName: 'regn3',
          iso3166: 'r3',
          termID: 2,
          name: 'stats2',
          unit: 'unit2',
          updatedAt: '2001-01-01 00:00:00'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(
        accountID,
        page
      );

      expect(stub.withArgs(`SELECT
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
      WHERE R1.veau_account_id = :veauAccountID
      LIMIT :limit
      OFFSET :offset;`, {
        veauAccountID: accountID.get().get(),
        limit: page.getLimit().get(),
        offset: page.getOffset().get()
      }).called).toEqual(true);
      expect(superposition.isSuccess()).toEqual(true);
      const statsOutlines: StatsOutlines = superposition.get();
      expect(statsOutlines.size()).toEqual(2);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        const statsOutline: StatsOutline = statsOutlines.get(i).get();
        expect(statsOutline.getStatsID().get().get()).toEqual(rows[i].statsID);
        expect(statsOutline.getLanguage().getLanguageID().get()).toEqual(rows[i].languageID);
        expect(statsOutline.getLanguage().getName().get()).toEqual(rows[i].languageName);
        expect(statsOutline.getLanguage().getEnglishName().get()).toEqual(rows[i].languageEnglishName);
        expect(statsOutline.getLanguage().getISO639().get()).toEqual(rows[i].iso639);
        expect(statsOutline.getRegion().getRegionID().get()).toEqual(rows[i].regionID);
        expect(statsOutline.getRegion().getName().get()).toEqual(rows[i].regionName);
        expect(statsOutline.getRegion().getISO3166().get()).toEqual(rows[i].iso3166);
        expect(statsOutline.getTerm().getID()).toEqual(rows[i].termID);
        expect(statsOutline.getName().get()).toEqual(rows[i].name);
        expect(statsOutline.getUnit().get()).toEqual(rows[i].unit);
        expect(statsOutline.getUpdatedAt().toString()).toEqual(rows[i].updatedAt);
      }
    });

    it('returns Failure when statsID is malformat', async () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: 'malformat uuid',
          languageID: 1,
          languageName: 'lang1',
          languageEnglishName: 'lang1',
          iso639: 'l1',
          regionID: 2,
          regionName: 'regn2',
          iso3166: 'r2',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: 'a25a8b7f-c810-4dc0-b94e-e97e74329307',
          languageID: 2,
          languageName: 'lang2',
          languageEnglishName: 'lang2',
          iso639: 'l2',
          regionID: 3,
          regionName: 'regn3',
          iso3166: 'r3',
          termID: 2,
          name: 'stats2',
          unit: 'unit2',
          updatedAt: '2001-01-01 00:00:00'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(VeauAccountID.ofString('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), Page.of(2).get());

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlinesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(VeauAccountID.ofString('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), Page.of(1).get());

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockError());

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      await expect(statsOutlineQuery.findByVeauAccountID(VeauAccountID.ofString('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), Page.of(1).get())).rejects.toThrow(MockError);
    });
  });
});
