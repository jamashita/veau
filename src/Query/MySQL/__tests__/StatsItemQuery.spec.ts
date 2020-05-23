import 'reflect-metadata';

import {
  Absent,
  Alive,
  DataSourceError,
  Dead,
  ImmutableProject,
  MockMySQL,
  MySQLError,
  Project,
  Superposition,
  UUID
} from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { StatsItemRow } from '../../../Entity/StatsItem/StatsItem';
import { StatsItems } from '../../../Entity/StatsItem/StatsItems';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { MockNumericalValue } from '../../../VO/NumericalValue/Mock/MockNumericalValue';
import { StatsItemsError } from '../../../VO/StatsItem/Error/StatsItemsError';
import { StatsItemID } from '../../../VO/StatsItem/StatsItemID';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { StatsValuesError } from '../../../VO/StatsValue/Error/StatsValuesError';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { StatsValues } from '../../../VO/StatsValue/StatsValues';
import { MockStatsValueQuery } from '../../Mock/MockStatsValueQuery';
import { StatsItemQuery } from '../StatsItemQuery';

describe('StatsItemQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsItemQuery1: StatsItemQuery = kernel.get<StatsItemQuery>(Type.StatsItemMySQLQuery);
      const statsItemQuery2: StatsItemQuery = kernel.get<StatsItemQuery>(Type.StatsItemMySQLQuery);

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
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 3
      });
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
      const project: Project<StatsItemID, StatsValues> = ImmutableProject.of<StatsItemID, StatsValues>(
        new Map<StatsItemID, StatsValues>([
          [
            StatsItemID.of(uuid2),
            new MockStatsValues(
              new MockStatsValue({
                asOf: asOf1,
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: new MockNumericalValue(4)
              })
            )
          ],
          [
            StatsItemID.of(uuid3),
            new MockStatsValues(
              new MockStatsValue({
                asOf: asOf1,
                value: new MockNumericalValue(11)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: new MockNumericalValue(12)
              })
            )
          ]
        ])
      );

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();

      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();
      const stub2: SinonStub = sinon.stub();

      statsValueQuery.findByStatsID = stub2;
      stub2.resolves(Alive.of<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>(project));

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const superposition: Superposition<
        StatsItems,
        StatsItemsError | DataSourceError
      > = await statsItemQuery.findByStatsID(statsID);

      expect(
        stub1.withArgs(
          `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`,
          {
            statsID: uuid1.get()
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const statsItems: StatsItems = superposition.get();

      expect(statsItems.size()).toBe(3);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i).get().getStatsItemID().get().get()).toBe(rows[i].statsItemID);
        expect(statsItems.get(i).get().getName().get()).toBe(rows[i].name);
      }

      const values2: StatsValues = statsItems.get(0).get().getValues();
      const values3: StatsValues = statsItems.get(1).get().getValues();

      expect(values2.size()).toBe(3);
      expect(values3.size()).toBe(2);

      expect(values2.get(asOf1).get().getValue().get()).toBe(1);
      expect(values2.get(asOf2).get().getValue().get()).toBe(2);
      expect(values2.get(asOf3).get().getValue().get()).toBe(4);
      expect(values3.get(asOf1).get().getValue().get()).toBe(11);
      expect(values3.get(asOf2).get().getValue().get()).toBe(12);
      expect(values3.get(asOf3)).toBeInstanceOf(Absent);
    });

    it('returns Dead when statsItems statsItemID is malformat', async () => {
      const statsID: MockStatsID = new MockStatsID();
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
      stub2.resolves(Alive.of<StatsValues, StatsValuesError | DataSourceError>(values));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const superposition: Superposition<
        StatsItems,
        StatsItemsError | DataSourceError
      > = await statsItemQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when StatsValueQuery throws StatsValuesError', async () => {
      const statsID: MockStatsID = new MockStatsID();
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
      stub2.resolves(Dead.of<StatsValues, StatsValuesError | DataSourceError>(new StatsValuesError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const superposition: Superposition<
        StatsItems,
        StatsItemsError | DataSourceError
      > = await statsItemQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when StatsValueQuery throws DataSourceError', async () => {
      const statsID: MockStatsID = new MockStatsID();
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
      stub2.resolves(Dead.of<StatsValues, StatsValuesError | DataSourceError>(new MySQLError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const superposition: Superposition<
        StatsItems,
        StatsItemsError | DataSourceError
      > = await statsItemQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
