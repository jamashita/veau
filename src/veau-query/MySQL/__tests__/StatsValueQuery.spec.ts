import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { StatsValuesError } from '../../../veau-error/StatsValuesError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockMySQL } from '../../../veau-general/MySQL/mocks/MockMySQL';
import { MockMySQLError } from '../../../veau-general/MySQL/mocks/MockMySQLError';
import { MySQLError } from '../../../veau-general/MySQL/MySQLError';
import { Try } from '../../../veau-general/Try/Try';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsValueRow } from '../../../veau-vo/StatsValue';
import { StatsValues } from '../../../veau-vo/StatsValues';
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
      const trial: Try<StatsValues, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(StatsID.of('d4703058-a6ff-420b-95b2-4475beba9027').get());

      expect(stub.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: 'd4703058-a6ff-420b-95b2-4475beba9027'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const values: StatsValues = trial.get();
      for (let i: number = 0; i < values.size(); i++) {
        expect(values.get(i).get().getStatsItemID().get()).toEqual(rows[i].statsItemID);
        expect(values.get(i).get().getAsOf().toString()).toEqual(rows[i].asOf);
        expect(values.get(i).get().getValue().get()).toEqual(rows[i].value);
      }
    });

    it('returns Failure when statsItemID is malformat', async () => {
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
      const trial: Try<StatsValues, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(StatsID.of('d4703058-a6ff-420b-95b2-4475beba9027').get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      const trial: Try<StatsValues, StatsValuesError | DataSourceError> = await statsValueQuery.findByStatsID(StatsID.of('d4703058-a6ff-420b-95b2-4475beba9027').get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const error: Error = new Error();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(error);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsValueQuery: StatsValueQuery = new StatsValueQuery(mysql);
      try {
        await statsValueQuery.findByStatsID(StatsID.of('d4703058-a6ff-420b-95b2-4475beba9027').get());
        spy1();
      }
      catch (err) {
        spy2();
        expect(err).toBe(error);
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
