import { Ambiguous } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import { ImmutableProject, Project } from '@jamashita/lluvia-collection';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { StatsItemRow } from '../../../domain/Entity/StatsItem/StatsItem';
import { StatsItems } from '../../../domain/Entity/StatsItem/StatsItems';
import { MockAsOf } from '../../../domain/VO/AsOf/Mock/MockAsOf';
import { NumericalValue } from '../../../domain/VO/NumericalValue/NumericalValue';
import { StatsItemError } from '../../../domain/VO/StatsItem/Error/StatsItemError';
import { StatsItemID } from '../../../domain/VO/StatsItem/StatsItemID';
import { MockStatsID } from '../../../domain/VO/StatsOutline/Mock/MockStatsID';
import { StatsValueError } from '../../../domain/VO/StatsValue/Error/StatsValueError';
import { MockStatsValue } from '../../../domain/VO/StatsValue/Mock/MockStatsValue';
import { StatsValues } from '../../../domain/VO/StatsValue/StatsValues';
import { MockStatsValueQuery } from '../../Mock/MockStatsValueQuery';
import { StatsItemQuery } from '../StatsItemQuery';

describe('StatsItemQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsItemQuery1: StatsItemQuery = kernel.get<StatsItemQuery>(Type.StatsItemMySQLQuery);
      const statsItemQuery2: StatsItemQuery = kernel.get<StatsItemQuery>(Type.StatsItemMySQLQuery);

      expect(statsItemQuery1).toBeInstanceOf(StatsItemQuery);
      expect(statsItemQuery1).toBe(statsItemQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      expect.assertions(17);

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
      const project: Project<StatsItemID, StatsValues> = ImmutableProject.ofMap<StatsItemID, StatsValues>(
        new Map<StatsItemID, StatsValues>([
          [
            StatsItemID.of(uuid2),
            StatsValues.ofSpread(
              new MockStatsValue({
                asOf: asOf1,
                value: NumericalValue.of(1)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: NumericalValue.of(2)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: NumericalValue.of(4)
              })
            )
          ],
          [
            StatsItemID.of(uuid3),
            StatsValues.ofSpread(
              new MockStatsValue({
                asOf: asOf1,
                value: NumericalValue.of(11)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: NumericalValue.of(12)
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
      stub2.returns(Superposition.alive<Project<StatsItemID, StatsValues>, MySQLError | StatsValueError>(project));

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const schrodinger: Schrodinger<StatsItems, MySQLError | StatsItemError> = await statsItemQuery.findByStatsID(statsID).terminate();

      expect(stub1.withArgs(
        `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`,
        {
          statsID: uuid1.get()
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const statsItems: StatsItems = schrodinger.get();

      expect(statsItems.size()).toBe(3);
      for (let i: number = 0; i < statsItems.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsItems.get(i)?.getStatsItemID().get().get()).toBe(rows[i]!.statsItemID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsItems.get(i)?.getName().get()).toBe(rows[i]!.name);
      }

      const values2: Ambiguous<StatsValues> = statsItems.get(0)?.getValues();
      const values3: Ambiguous<StatsValues> = statsItems.get(1)?.getValues();

      expect(values2?.size()).toBe(3);
      expect(values3?.size()).toBe(2);

      expect(values2?.get(asOf1)?.getValue().get()).toBe(1);
      expect(values2?.get(asOf2)?.getValue().get()).toBe(2);
      expect(values2?.get(asOf3)?.getValue().get()).toBe(4);
      expect(values3?.get(asOf1)?.getValue().get()).toBe(11);
      expect(values3?.get(asOf2)?.getValue().get()).toBe(12);
      expect(values3?.get(asOf3)).toBeNull();
    });

    it('returns Dead when statsItems statsItemID is malformat', async () => {
      expect.assertions(2);

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
      const values: StatsValues = StatsValues.empty();

      const mysql: MockMySQL = new MockMySQL();
      const stub1: SinonStub = sinon.stub();

      mysql.execute = stub1;
      stub1.resolves(rows);
      const statsValueQuery: MockStatsValueQuery = new MockStatsValueQuery();
      const stub2: SinonStub = sinon.stub();

      statsValueQuery.findByStatsID = stub2;
      stub2.returns(Superposition.alive<StatsValues, MySQLError | StatsValueError>(values));

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const schrodinger: Schrodinger<StatsItems, MySQLError | StatsItemError> = await statsItemQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsItemError);
    });

    it('returns Dead when StatsValueQuery throws StatsValueError', async () => {
      expect.assertions(2);

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
      stub2.returns(Superposition.dead<StatsValues, MySQLError | StatsValueError>(new StatsValueError('test failed'), StatsValueError));

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const schrodinger: Schrodinger<StatsItems, MySQLError | StatsItemError> = await statsItemQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsItemError);
    });

    it('returns Dead when StatsValueQuery throws MySQLError', async () => {
      expect.assertions(2);

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
      stub2.returns(Superposition.dead<StatsValues, MySQLError | StatsValueError>(new MySQLError('test faied'), MySQLError));

      const statsItemQuery: StatsItemQuery = new StatsItemQuery(mysql, statsValueQuery);
      const schrodinger: Schrodinger<StatsItems, MySQLError | StatsItemError> = await statsItemQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
