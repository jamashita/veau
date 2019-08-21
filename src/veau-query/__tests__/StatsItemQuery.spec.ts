import 'jest';
import sinon, { SinonStub } from 'sinon';
import { StatsItems } from '../../veau-entity/collection/StatsItems';
import { veauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemQuery } from '../StatsItemQuery';

describe('StatsItemQuery', () => {
  describe('normal case', () => {
    it('findByStatsID', async () => {
      const statsID: string = '428a0978-5d01-4da6-96f3-f851cb18e935';
      const stub: SinonStub = sinon.stub();
      veauMySQL.execute = stub;
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

      const statsItemQuery: StatsItemQuery = StatsItemQuery.getInstance();
      const statsItems: StatsItems = await statsItemQuery.findByStatsID(StatsID.of(statsID));

      expect(statsItems.length()).toEqual(3);
      expect(statsItems.get(0).getStatsItemID().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
      expect(statsItems.get(0).getName().get()).toEqual('name1');
      expect(statsItems.get(0).getValues().length()).toEqual(3);
      expect(statsItems.get(0).getValues().get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(statsItems.get(0).getValues().get(0).getValue()).toEqual(1);
      expect(statsItems.get(0).getValues().get(1).getAsOf().format('YYYY-MM-DD')).toEqual('2000-01-02');
      expect(statsItems.get(0).getValues().get(1).getValue()).toEqual(2);
      expect(statsItems.get(0).getValues().get(2).getAsOf().format('YYYY-MM-DD')).toEqual('2000-01-03');
      expect(statsItems.get(0).getValues().get(2).getValue()).toEqual(3);
      expect(statsItems.get(1).getStatsItemID().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
      expect(statsItems.get(1).getName().get()).toEqual('name2');
      expect(statsItems.get(1).getValues().length()).toEqual(2);
      expect(statsItems.get(1).getValues().get(0).getAsOfAsString()).toEqual('2001-01-01');
      expect(statsItems.get(1).getValues().get(0).getValue()).toEqual(11);
      expect(statsItems.get(1).getValues().get(1).getAsOf().format('YYYY-MM-DD')).toEqual('2001-01-02');
      expect(statsItems.get(1).getValues().get(1).getValue()).toEqual(12);
      expect(statsItems.get(2).getStatsItemID().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
      expect(statsItems.get(2).getName().get()).toEqual('name3');
      expect(statsItems.get(2).getValues().length()).toEqual(0);
    });
  });
});
