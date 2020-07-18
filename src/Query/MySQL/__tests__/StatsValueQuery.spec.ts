import 'reflect-metadata';

import sinon, { SinonStub } from 'sinon';

import { Project } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { MockMySQL, MySQLError } from '@jamashita/publikum-mysql';
import { Nullable } from '@jamashita/publikum-type';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { AsOf } from '../../../VO/AsOf/AsOf';
import { StatsItemID } from '../../../VO/StatsItem/StatsItemID';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { StatsValuesError } from '../../../VO/StatsValue/Error/StatsValuesError';
import { StatsValueRow } from '../../../VO/StatsValue/StatsValue';
import { StatsValues } from '../../../VO/StatsValue/StatsValues';
import { StatsValueQuery } from '../StatsValueQuery';

describe('StatsValueQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsValueQuery1: StatsValueQuery = kernel.get<StatsValueQuery>(Type.StatsValueMySQLQuery);
      const statsValueQuery2: StatsValueQuery = kernel.get<StatsValueQuery>(Type.StatsValueMySQLQuery);

      expect(statsValueQuery1).toBeInstanceOf(StatsValueQuery);
      expect(statsValueQuery1).toBe(statsValueQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const statsItemID1: string = '98d1e9b5-6b18-44de-b615-d8016f49977d';
      const statsItemID2: string = '5318ad74-f15f-4835-9fd7-890be4cce933';
      const asOf1: string = '2000-01-01';
      const asOf2: string = '2000-01-02';
      const asOf3: string = '2000-01-03';
      const rows: Array<StatsValueRow> = [
        {
          statsItemID: statsItemID1,
          asOf: asOf1,
          value: 1
        },
        {
          statsItemID: statsItemID2,
          asOf: asOf1,
          value: 11
        },
        {
          statsItemID: statsItemID1,
          asOf: asOf2,
          value: 2
        },
        {
          statsItemID: statsItemID2,
          asOf: asOf2,
          value: 12
        },
        {
          statsItemID: statsItemID1,
          asOf: asOf3,
          value: 3
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      const schrodinger: Schrodinger<
        Project<StatsItemID, StatsValues>,
        StatsValuesError | DataSourceError
      > = await statsValueQuery.findByStatsID(statsID).terminate();

      expect(
        stub.withArgs(
          `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`,
          {
            statsID: statsID.get().get()
          }
        ).called
      ).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const project: Project<StatsItemID, StatsValues> = schrodinger.get();
      const statsValues1: Nullable<StatsValues> = project.get(await StatsItemID.ofString(statsItemID1).get());
      const statsValues2: Nullable<StatsValues> = project.get(await StatsItemID.ofString(statsItemID2).get());

      expect(
        statsValues1
          ?.get(await AsOf.ofString(asOf1).get())
          ?.getValue()
          .get()
      ).toBe(1);
      expect(
        statsValues1
          ?.get(await AsOf.ofString(asOf2).get())
          ?.getValue()
          .get()
      ).toBe(2);
      expect(
        statsValues1
          ?.get(await AsOf.ofString(asOf3).get())
          ?.getValue()
          .get()
      ).toBe(3);
      expect(
        statsValues2
          ?.get(await AsOf.ofString(asOf1).get())
          ?.getValue()
          .get()
      ).toBe(11);
      expect(
        statsValues2
          ?.get(await AsOf.ofString(asOf2).get())
          ?.getValue()
          .get()
      ).toBe(12);
      expect(statsValues2?.get(await AsOf.ofString(asOf3).get())).toBe(null);
    });

    it('returns Dead when statsItemID is malformat', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const rows: Array<StatsValueRow> = [
        {
          statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: '5318ad74-f15f-4835-9fd7-890be4cce933',
          asOf: '2001-01-01',
          value: 11
        },
        {
          statsItemID: 'malformat uuid',
          asOf: '2000-01-02',
          value: 2
        },
        {
          statsItemID: '5318ad74-f15f-4835-9fd7-890be4cce933',
          asOf: '2001-01-02',
          value: 12
        },
        {
          statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
          asOf: '2000-01-03',
          value: 3
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      const schrodinger: Schrodinger<
        Project<StatsItemID, StatsValues>,
        StatsValuesError | DataSourceError
      > = await statsValueQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsValuesError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      const schrodinger: Schrodinger<
        Project<StatsItemID, StatsValues>,
        StatsValuesError | DataSourceError
      > = await statsValueQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
