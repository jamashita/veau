import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { StatsItemRow } from '../../../Entity/StatsItem';
import { StatsItems } from '../../../Entity/StatsItems';
import { StatsItemsError } from '../../../Error/StatsItemsError';
import { StatsValuesError } from '../../../Error/StatsValuesError';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/Mock/MockError';
import { MockMySQL } from '../../../General/MySQL/Mock/MockMySQL';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { Failure } from '../../../General/Superposition/Failure';
import { Success } from '../../../General/Superposition/Success';
import { Superposition } from '../../../General/Superposition/Superposition';
import { UUID } from '../../../General/UUID/UUID';
import { MockAsOf } from '../../../VO/Mock/MockAsOf';
import { MockNumericalValue } from '../../../VO/Mock/MockNumericalValue';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsItemID } from '../../../VO/Mock/MockStatsItemID';
import { MockStatsValue } from '../../../VO/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/Mock/MockStatsValues';
import { StatsID } from '../../../VO/StatsID';
import { StatsValues } from '../../../VO/StatsValues';
import { MockStatsValueQuery } from '../../Mock/MockStatsValueQuery';
import { StatsItemQuery } from '../StatsItemQuery';

// DONE
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
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const itemName1: string = 'item name 1';
      const itemName2: string = 'item name 2';
      const itemName3: string = 'item name 3';
      const statsID: MockStatsID = new MockStatsID(uuid1);
      const rows: Array<StatsItemRow> = [
        {
          statsItemID: uuid2.get(),
          name: itemName1
        },
        {
          statsItemID: uuid3.get(),
          name: itemName2
        },
        {
          statsItemID: uuid4.get(),
          name: itemName3
        }
      ];
      const values: StatsValues = new MockStatsValues(
        new MockStatsValue({
          statsItemID: new MockStatsItemID(uuid2),
          asOf: new MockAsOf({
            day: 1
          }),
          value: new MockNumericalValue(1)
        }),
        new MockStatsValue({
          statsItemID: new MockStatsItemID(uuid3),
          asOf: new MockAsOf({
            day: 1
          }),
          value: new MockNumericalValue(11)
        }),
        new MockStatsValue({
          statsItemID: new MockStatsItemID(uuid2),
          asOf: new MockAsOf({
            day: 2
          }),
          value: new MockNumericalValue(2)
        }),
        new MockStatsValue({
          statsItemID: new MockStatsItemID(uuid3),
          asOf: new MockAsOf({
            day: 2
          }),
          value: new MockNumericalValue(12)
        }),
        new MockStatsValue({
          statsItemID: new MockStatsItemID(uuid2),
          asOf: new MockAsOf({
            day: 3
          }),
          value: new MockNumericalValue(4)
        })
      );

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();
      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();
      const stub2: SinonStub = sinon.stub();
      statsValueQuery.findByStatsID = stub2;
      stub2.resolves(Success.of<StatsValues, StatsValuesError | DataSourceError>(values));

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const trial: Superposition<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

      expect(stub1.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`, {
        statsID: uuid1.get()
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
      const values: MockStatsValues = new MockStatsValues();

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
      const trial: Superposition<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

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
      const trial: Superposition<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

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
      stub2.resolves(Failure.of<StatsValues, StatsValuesError | DataSourceError>(new MySQLError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const trial: Superposition<StatsItems, StatsItemsError | DataSourceError> = await statsItemQuery.findByStatsID(statsID);

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
