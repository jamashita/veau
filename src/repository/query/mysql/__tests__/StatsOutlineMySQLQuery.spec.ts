import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { cask } from '../../../../container/Cask';
import { Type } from '../../../../container/Types';
import { MockPage } from '../../../../domain/vo/Page/mock/MockPage';
import { StatsOutlineError } from '../../../../domain/vo/StatsOutline/error/StatsOutlineError';
import { MockStatsID } from '../../../../domain/vo/StatsOutline/mock/MockStatsID';
import { StatsID } from '../../../../domain/vo/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineRow } from '../../../../domain/vo/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../../domain/vo/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../../../domain/vo/VeauAccount/mock/MockVeauAccountID';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { StatsOutlineMySQLQuery } from '../StatsOutlineMySQLQuery';

describe('StatsOutlineMySQLQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsOutlineQuery1: StatsOutlineMySQLQuery = cask.get<StatsOutlineMySQLQuery>(Type.StatsOutlineMySQLQuery);
      const statsOutlineQuery2: StatsOutlineMySQLQuery = cask.get<StatsOutlineMySQLQuery>(Type.StatsOutlineMySQLQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineMySQLQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      expect.assertions(9);

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

      const statsOutlineQuery: StatsOutlineMySQLQuery = new StatsOutlineMySQLQuery(mysql);
      const schrodinger: Schrodinger<StatsOutline, DataSourceError | NoSuchElementError | StatsOutlineError> = await statsOutlineQuery.find(statsID).terminate();

      expect(stub.withArgs(
        `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      WHERE R1.stats_id = :statsID;`,
        {
          statsID: statsID.get().get()
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const statsOutline: StatsOutline = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsOutline.getStatsID().get().get()).toBe(rows[0]!.statsID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsOutline.getLanguageID().get().get()).toBe(rows[0]!.languageID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsOutline.getRegionID().get().get()).toBe(rows[0]!.regionID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsOutline.getTermID().get().get()).toBe(rows[0]!.termID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsOutline.getName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsOutline.getUnit().get()).toBe(rows[0]!.unit);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsOutline.getUpdatedAt().toString()).toBe(rows[0]!.updatedAt);
    });

    it('returns no results', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsOutlineRow> = [];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const statsOutlineQuery: StatsOutlineMySQLQuery = new StatsOutlineMySQLQuery(mysql);
      const schrodinger: Schrodinger<StatsOutline, DataSourceError | NoSuchElementError | StatsOutlineError> = await statsOutlineQuery.find(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const statsOutlineQuery: StatsOutlineMySQLQuery = new StatsOutlineMySQLQuery(mysql);
      const schrodinger: Schrodinger<StatsOutline, DataSourceError | NoSuchElementError | StatsOutlineError> = await statsOutlineQuery.find(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      expect.assertions(17);

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

      const statsOutlineQuery: StatsOutlineMySQLQuery = new StatsOutlineMySQLQuery(mysql);
      const schrodinger: Schrodinger<StatsOutlines, DataSourceError | StatsOutlineError> = await statsOutlineQuery.findByVeauAccountID(accountID, page).terminate();

      expect(stub.withArgs(
        `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      WHERE R1.veau_account_id = :veauAccountID
      LIMIT :limit
      OFFSET :offset;`,
        {
          veauAccountID: accountID.get().get(),
          limit: page.getLimit().get(),
          offset: page.getOffset().get()
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);

      const statsOutlines: StatsOutlines = schrodinger.get();

      expect(statsOutlines.size()).toBe(2);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const statsOutline: Nullable<StatsOutline> = statsOutlines.get(StatsID.ofString(rows[i]!.statsID));

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutline?.getStatsID().get().get()).toBe(rows[i]!.statsID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutline?.getLanguageID().get().get()).toBe(rows[i]!.languageID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutline?.getRegionID().get().get()).toBe(rows[i]!.regionID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutline?.getTermID().get().get()).toBe(rows[i]!.termID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutline?.getName().get()).toBe(rows[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutline?.getUnit().get()).toBe(rows[i]!.unit);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutline?.getUpdatedAt().toString()).toBe(rows[i]!.updatedAt);
      }
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const statsOutlineQuery: StatsOutlineMySQLQuery = new StatsOutlineMySQLQuery(mysql);
      const schrodinger: Schrodinger<StatsOutlines, DataSourceError | StatsOutlineError> = await statsOutlineQuery.findByVeauAccountID(accountID, page).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
