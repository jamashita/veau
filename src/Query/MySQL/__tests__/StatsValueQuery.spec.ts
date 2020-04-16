import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { StatsValuesError } from '../../../Error/StatsValuesError';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/Mock/MockError';
import { MockMySQL } from '../../../General/MySQL/Mock/MockMySQL';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Superposition } from '../../../General/Superposition/Superposition';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { StatsValueRow } from '../../../VO/StatsValue';
import { StatsValues } from '../../../VO/StatsValues';
import { StatsValueQuery } from '../StatsValueQuery';

// DONE
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
          statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
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
      const superposition: Superposition<StatsValues, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(statsID);

      expect(stub.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: statsID.get().get()
      }).called).toEqual(true);
      expect(superposition.isSuccess()).toEqual(true);
      const values: StatsValues = superposition.get();
      for (let i: number = 0; i < values.size(); i++) {
        expect(values.get(i).get().getStatsItemID().get().get()).toEqual(rows[i].statsItemID);
        expect(values.get(i).get().getAsOf().toString()).toEqual(rows[i].asOf);
        expect(values.get(i).get().getValue().get()).toEqual(rows[i].value);
      }
    });

    it('returns Failure when statsItemID is malformat', async () => {
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
      const superposition: Superposition<StatsValues, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(statsID);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      const superposition: Superposition<StatsValues, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(statsID);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError | DataSourceError) => {
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

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      await expect(statsValueQuery.findByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
