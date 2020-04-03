import 'jest';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { StatsItems } from '../../veau-entity/StatsItems';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemQuery } from '../StatsItemQuery';

describe('StatsItemQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsItemQuery1: StatsItemQuery = container.get<StatsItemQuery>(TYPE.StatsItemQuery);
      const statsItemQuery2: StatsItemQuery = container.get<StatsItemQuery>(TYPE.StatsItemQuery);

      expect(statsItemQuery1).toBeInstanceOf(StatsItemQuery);
      expect(statsItemQuery1).toBe(statsItemQuery2);
    });
  });

  describe('normal case', () => {
    it('findByStatsID', async () => {
      const statsID: string = '428a0978-5d01-4da6-96f3-f851cb18e935';
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.onCall(0).resolves([
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
      ]);
      stub.onCall(1).resolves([
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          asOf: '2001-01-01',
          value: 11
        },
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-02',
          value: 2
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          asOf: '2001-01-02',
          value: 12
        },
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-03',
          value: 3
        }
      ]);

      const statsItemQuery: StatsItemQuery = container.get<StatsItemQuery>(TYPE.StatsItemQuery);
      const statsItems: StatsItems = await statsItemQuery.findByStatsID(StatsID.of(statsID).get());

      expect(statsItems.size()).toEqual(3);
      expect(statsItems.get(0).getStatsItemID().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
      expect(statsItems.get(0).getName().get()).toEqual('name1');
      expect(statsItems.get(0).getValues().size()).toEqual(3);
      expect(statsItems.get(0).getValues().get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(statsItems.get(0).getValues().get(0).getValue().get()).toEqual(1);
      expect(statsItems.get(0).getValues().get(1).getAsOfAsString()).toEqual('2000-01-02');
      expect(statsItems.get(0).getValues().get(1).getValue().get()).toEqual(2);
      expect(statsItems.get(0).getValues().get(2).getAsOfAsString()).toEqual('2000-01-03');
      expect(statsItems.get(0).getValues().get(2).getValue().get()).toEqual(3);
      expect(statsItems.get(1).getStatsItemID().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
      expect(statsItems.get(1).getName().get()).toEqual('name2');
      expect(statsItems.get(1).getValues().size()).toEqual(2);
      expect(statsItems.get(1).getValues().get(0).getAsOfAsString()).toEqual('2001-01-01');
      expect(statsItems.get(1).getValues().get(0).getValue().get()).toEqual(11);
      expect(statsItems.get(1).getValues().get(1).getAsOfAsString()).toEqual('2001-01-02');
      expect(statsItems.get(1).getValues().get(1).getValue().get()).toEqual(12);
      expect(statsItems.get(2).getStatsItemID().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
      expect(statsItems.get(2).getName().get()).toEqual('name3');
      expect(statsItems.get(2).getValues().size()).toEqual(0);
    });
  });
});
