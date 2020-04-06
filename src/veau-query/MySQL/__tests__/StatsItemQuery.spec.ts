import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { StatsItems } from '../../../veau-entity/StatsItems';
import { StatsItemsError } from '../../../veau-error/StatsItemsError';
import { MySQL } from '../../../veau-general/MySQL/MySQL';
import { Try } from '../../../veau-general/Try/Try';
import { StatsID } from '../../../veau-vo/StatsID';
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

      const statsItemQuery: StatsItemQuery = kernel.get<StatsItemQuery>(TYPE.StatsItemMySQLQuery);
      const trial: Try<StatsItems, StatsItemsError> = await statsItemQuery.findByStatsID(StatsID.of(statsID).get());

      expect(trial.isSuccess()).toEqual(true);
      const statsItems: StatsItems = trial.get();
      expect(statsItems.size()).toEqual(3);
      expect(statsItems.get(0).get().getStatsItemID().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
      expect(statsItems.get(0).get().getName().get()).toEqual('name1');
      expect(statsItems.get(0).get().getValues().size()).toEqual(3);
      expect(statsItems.get(0).get().getValues().get(0).get().getAsOf().toString()).toEqual('2000-01-01');
      expect(statsItems.get(0).get().getValues().get(0).get().getValue().get()).toEqual(1);
      expect(statsItems.get(0).get().getValues().get(1).get().getAsOf().toString()).toEqual('2000-01-02');
      expect(statsItems.get(0).get().getValues().get(1).get().getValue().get()).toEqual(2);
      expect(statsItems.get(0).get().getValues().get(2).get().getAsOf().toString()).toEqual('2000-01-03');
      expect(statsItems.get(0).get().getValues().get(2).get().getValue().get()).toEqual(3);
      expect(statsItems.get(1).get().getStatsItemID().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
      expect(statsItems.get(1).get().getName().get()).toEqual('name2');
      expect(statsItems.get(1).get().getValues().size()).toEqual(2);
      expect(statsItems.get(1).get().getValues().get(0).get().getAsOf().toString()).toEqual('2001-01-01');
      expect(statsItems.get(1).get().getValues().get(0).get().getValue().get()).toEqual(11);
      expect(statsItems.get(1).get().getValues().get(1).get().getAsOf().toString()).toEqual('2001-01-02');
      expect(statsItems.get(1).get().getValues().get(1).get().getValue().get()).toEqual(12);
      expect(statsItems.get(2).get().getStatsItemID().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
      expect(statsItems.get(2).get().getName().get()).toEqual('name3');
      expect(statsItems.get(2).get().getValues().size()).toEqual(0);
    });

    it('returns Failure when statsItems\' statsItemID is malformat', async () => {
      const statsID: string = '428a0978-5d01-4da6-96f3-f851cb18e935';
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.onCall(0).resolves([
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = kernel.get<StatsItemQuery>(TYPE.StatsItemMySQLQuery);
      const trial: Try<StatsItems, StatsItemsError> = await statsItemQuery.findByStatsID(StatsID.of(statsID).get());

      expect(trial.isFailure()).toEqual(true);

      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when statsValues\' statsItemID is malformat', async () => {
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
          statsItemID: 'malformat uuid',
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: StatsItemQuery = kernel.get<StatsItemQuery>(TYPE.StatsItemMySQLQuery);
      const trial: Try<StatsItems, StatsItemsError> = await statsItemQuery.findByStatsID(StatsID.of(statsID).get());

      expect(trial.isFailure()).toEqual(true);

      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
