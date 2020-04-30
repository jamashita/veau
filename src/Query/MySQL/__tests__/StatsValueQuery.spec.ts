import {
  Absent,
  DataSourceError,
  MockError,
  MockMySQL,
  MySQLError,
  Project,
  Superposition
} from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { StatsValuesError } from '../../../Error/StatsValuesError';
import { AsOf } from '../../../VO/AsOf';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { StatsItemID } from '../../../VO/StatsItemID';
import { StatsValueRow } from '../../../VO/StatsValue';
import { StatsValues } from '../../../VO/StatsValues';
import { StatsValueQuery } from '../StatsValueQuery';

describe('StatsValueQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsValueQuery1: StatsValueQuery = kernel.get<StatsValueQuery>(TYPE.StatsValueMySQLQuery);
      const statsValueQuery2: StatsValueQuery = kernel.get<StatsValueQuery>(TYPE.StatsValueMySQLQuery);

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
      const superposition: Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(statsID);

      expect(stub.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: statsID.get().get()
      }).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const project: Project<StatsItemID, StatsValues> = superposition.get();
      const statsValues1: StatsValues = project.get(StatsItemID.ofString(statsItemID1).get()).get();
      const statsValues2: StatsValues = project.get(StatsItemID.ofString(statsItemID2).get()).get();

      expect(statsValues1.get(AsOf.ofString(asOf1).get()).get().getValue().get()).toBe(1);
      expect(statsValues1.get(AsOf.ofString(asOf2).get()).get().getValue().get()).toBe(2);
      expect(statsValues1.get(AsOf.ofString(asOf3).get()).get().getValue().get()).toBe(3);
      expect(statsValues2.get(AsOf.ofString(asOf1).get()).get().getValue().get()).toBe(11);
      expect(statsValues2.get(AsOf.ofString(asOf2).get()).get().getValue().get()).toBe(12);
      expect(statsValues2.get(AsOf.ofString(asOf3).get())).toBeInstanceOf(Absent);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      const superposition: Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

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

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      const superposition: Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError | DataSourceError) => {
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

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      await expect(statsValueQuery.findByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
