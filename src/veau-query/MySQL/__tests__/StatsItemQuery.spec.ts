import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { StatsItemRow } from '../../../veau-entity/StatsItem';
import { StatsItems } from '../../../veau-entity/StatsItems';
import { StatsItemsError } from '../../../veau-error/StatsItemsError';
import { StatsValuesError } from '../../../veau-error/StatsValuesError';
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
import { StatsValue } from '../../../veau-vo/StatsValue';
import { StatsValues } from '../../../veau-vo/StatsValues';
import { MockStatsValueQuery } from '../../Mock/MockStatsValueQuery';
import { StatsItemQuery } from '../StatsItemQuery';

describe('StatsItemQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsItemQuery1: StatsItemQuery = kernel.get<StatsItemQuery>(TYPE.StatsItemMySQLQuery);
      const statsItemQuery2: StatsItemQuery = kernel.get<StatsItemQuery>(TYPE.StatsItemMySQLQuery);

      expect(statsItemQuery1).toBeInstanceOf(StatsItemQuery);
      expect(statsItemQuery1).toBe(statsItemQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('428a0978-5d01-4da6-96f3-f851cb18e935').get();
      const rows: Array<StatsItemRow> = [
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          name: 'name1'
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          name: 'name2'
        },
        {
          statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
          name: 'name3'
        }
      ];
      const values: StatsValues = StatsValues.ofArray([
        StatsValue.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          AsOf.ofString('2000-01-01').get(),
          NumericalValue.of(1)
        ),
        StatsValue.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          AsOf.ofString('2001-01-01').get(),
          NumericalValue.of(11)
        ),
        StatsValue.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          AsOf.ofString('2000-01-02').get(),
          NumericalValue.of(2)
        ),
        StatsValue.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          AsOf.ofString('2001-01-02').get(),
          NumericalValue.of(12)
        ),
        StatsValue.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          AsOf.ofString('2000-01-03').get(),
          NumericalValue.of(3)
        )
      ]);

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();
      const stub2: SinonStub = sinon.stub();
      statsValueQuery.findByStatsID = stub2;
      stub2.resolves(Success.of<StatsValues, StatsValuesError | DataSourceError>(values));

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const trial: Try<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

      expect(stub1.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`, {
        statsID: '428a0978-5d01-4da6-96f3-f851cb18e935'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const statsItems: StatsItems = trial.get();
      expect(statsItems.size()).toEqual(3);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i).get().getStatsItemID().get().get()).toEqual(rows[i].statsItemID);
        expect(statsItems.get(i).get().getName().get()).toEqual(rows[i].name);

        const vs: StatsValues = values.filter(statsItems.get(i).get().getStatsItemID());
        expect(statsItems.get(i).get().getValues().size()).toEqual(vs.size());

        for (let j: number = 0; j < vs.size(); j++) {
          expect(statsItems.get(i).get().getValues().get(j).get().getStatsItemID().get()).toEqual(vs.get(j).get().getStatsItemID().get());
          expect(statsItems.get(i).get().getValues().get(j).get().getAsOf().toString()).toEqual(vs.get(j).get().getAsOf().toString());
          expect(statsItems.get(i).get().getValues().get(j).get().getValue().get()).toEqual(vs.get(j).get().getValue().get());
        }
      }
    });

    it('returns Failure when statsItems\' statsItemID is malformat', async () => {
      const statsID: StatsID = StatsID.ofString('428a0978-5d01-4da6-96f3-f851cb18e935').get();
      const rows: Array<StatsItemRow> = [
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          name: 'name1'
        },
        {
          statsItemID: 'malformat uuid',
          name: 'name2'
        },
        {
          statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
          name: 'name3'
        }
      ];
      const values: StatsValues = StatsValues.ofArray([
        StatsValue.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          AsOf.ofString('2000-01-01').get(),
          NumericalValue.of(1)
        ),
        StatsValue.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          AsOf.ofString('2001-01-01').get(),
          NumericalValue.of(11)
        ),
        StatsValue.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          AsOf.ofString('2000-01-02').get(),
          NumericalValue.of(2)
        ),
        StatsValue.of(
          StatsItemID.ofString('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
          AsOf.ofString('2001-01-02').get(),
          NumericalValue.of(12)
        ),
        StatsValue.of(
          StatsItemID.ofString('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          AsOf.ofString('2000-01-03').get(),
          NumericalValue.of(3)
        )
      ]);

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();
      const stub2: SinonStub = sinon.stub();
      statsValueQuery.findByStatsID = stub2;
      stub2.resolves(Success.of<StatsValues, StatsValuesError | DataSourceError>(values));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const trial: Try<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when StatsValueQuery throws StatsValuesError', async () => {
      const statsID: StatsID = StatsID.ofString('428a0978-5d01-4da6-96f3-f851cb18e935').get();
      const rows: Array<StatsItemRow> = [
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          name: 'name1'
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          name: 'name2'
        },
        {
          statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
          name: 'name3'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();
      const stub2: SinonStub = sinon.stub();
      statsValueQuery.findByStatsID = stub2;
      stub2.resolves(Failure.of<StatsValues, StatsValuesError | DataSourceError>(new StatsValuesError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const trial: Try<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when StatsValueQuery throws DataSourceError', async () => {
      const statsID: StatsID = StatsID.ofString('428a0978-5d01-4da6-96f3-f851cb18e935').get();
      const rows: Array<StatsItemRow> = [
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          name: 'name1'
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          name: 'name2'
        },
        {
          statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
          name: 'name3'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();
      const stub2: SinonStub = sinon.stub();
      statsValueQuery.findByStatsID = stub2;
      stub2.resolves(Failure.of<StatsValues, StatsValuesError | DataSourceError>(new MockMySQLError()));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const trial: Try<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const statsID: StatsID = StatsID.ofString('428a0978-5d01-4da6-96f3-f851cb18e935').get();

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.rejects(new MockError());
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      await expect(statsItemQuery.findByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
