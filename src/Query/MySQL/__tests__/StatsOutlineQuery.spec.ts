import 'reflect-metadata';

import { DataSourceError, MockError, MockMySQL, MySQLError, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { MockPage } from '../../../VO/Page/Mock/MockPage';
import { StatsOutlineError } from '../../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutlinesError } from '../../../VO/StatsOutline/Error/StatsOutlinesError';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineRow } from '../../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../VO/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsOutlineQuery1: StatsOutlineQuery = kernel.get<StatsOutlineQuery>(Type.StatsOutlineMySQLQuery);
      const statsOutlineQuery2: StatsOutlineQuery = kernel.get<StatsOutlineQuery>(Type.StatsOutlineMySQLQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      const superposition: Superposition<
        StatsOutline,
        StatsOutlineError | NoSuchElementError | DataSourceError
      > = await statsOutlineQuery.find(statsID);

      expect(
        stub.withArgs(
          `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.stats_id = :statsID;`,
          {
            statsID: statsID.get().get()
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const statsOutline: StatsOutline = superposition.get();
      expect(statsOutline.getStatsID().get().get()).toBe(rows[0].statsID);
      expect(statsOutline.getLanguageID().get().get()).toBe(rows[0].languageID);
      expect(statsOutline.getRegionID().get().get()).toBe(rows[0].regionID);
      expect(statsOutline.getTermID().get().get()).toBe(rows[0].termID);
      expect(statsOutline.getName().get()).toBe(rows[0].name);
      expect(statsOutline.getUnit().get()).toBe(rows[0].unit);
      expect(statsOutline.getUpdatedAt().toString()).toBe(rows[0].updatedAt);
    });

    it('returns no results', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsOutlineRow> = [];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      const superposition: Superposition<
        StatsOutline,
        StatsOutlineError | NoSuchElementError | DataSourceError
      > = await statsOutlineQuery.find(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsOutlineError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      const superposition: Superposition<
        StatsOutline,
        StatsOutlineError | NoSuchElementError | DataSourceError
      > = await statsOutlineQuery.find(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsOutlineError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage();
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
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
      const superposition: Superposition<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(accountID, page);

      expect(
        stub.withArgs(
          `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
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
      OFFSET :offset;`,
          {
            veauAccountID: accountID.get().get(),
            limit: page.getLimit().get(),
            offset: page.getOffset().get()
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const statsOutlines: StatsOutlines = superposition.get();
      expect(statsOutlines.size()).toBe(2);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        const statsOutline: StatsOutline = statsOutlines.get(StatsID.ofString(rows[i].statsID).get()).get();
        expect(statsOutline.getStatsID().get().get()).toBe(rows[i].statsID);
        expect(statsOutline.getLanguageID().get().get()).toBe(rows[i].languageID);
        expect(statsOutline.getRegionID().get().get()).toBe(rows[i].regionID);
        expect(statsOutline.getTermID().get().get()).toBe(rows[i].termID);
        expect(statsOutline.getName().get()).toBe(rows[i].name);
        expect(statsOutline.getUnit().get()).toBe(rows[i].unit);
        expect(statsOutline.getUpdatedAt().toString()).toBe(rows[i].updatedAt);
      }
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(mysql);
      const superposition: Superposition<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(accountID, page);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsOutlinesError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
