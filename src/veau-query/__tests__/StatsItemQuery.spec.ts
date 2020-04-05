import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsItems } from '../../veau-entity/StatsItems';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { AsOf } from '../../veau-vo/AsOf';
import { NumericalValue } from '../../veau-vo/NumericalValue';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { IStatsItemQuery } from '../interfaces/IStatsItemQuery';
import { StatsItemQuery as StatsItemMySQLQuery } from '../MySQL/StatsItemQuery';
import { StatsItemQuery } from '../StatsItemQuery';

describe('StatsItemQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsItemQuery1: IStatsItemQuery = container.get<IStatsItemQuery>(TYPE.StatsItemQuery);
      const statsItemQuery2: IStatsItemQuery = container.get<IStatsItemQuery>(TYPE.StatsItemQuery);

      expect(statsItemQuery1).toBeInstanceOf(StatsItemQuery);
      expect(statsItemQuery1).toBe(statsItemQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: string = '428a0978-5d01-4da6-96f3-f851cb18e935';
      const stub: SinonStub = sinon.stub();
      StatsItemMySQLQuery.prototype.findByStatsID = stub;
      stub.resolves(Success.of<StatsItems, StatsItemsError>(StatsItems.of([
        StatsItem.of(StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(), StatsItemName.of('name1'), StatsValues.of([
          StatsValue.of(StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
          StatsValue.of(StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(2)),
          StatsValue.of(StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(3))
        ])),
        StatsItem.of(StatsItemID.of('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(), StatsItemName.of('name2'), StatsValues.of([
          StatsValue.of(StatsItemID.of('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(), AsOf.ofString('2001-01-01').get(), NumericalValue.of(11)),
          StatsValue.of(StatsItemID.of('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(), AsOf.ofString('2001-01-02').get(), NumericalValue.of(12))
        ])),
        StatsItem.of(StatsItemID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), StatsItemName.of('name3'), StatsValues.of([
        ]))
      ])));

      const statsItemQuery: IStatsItemQuery = container.get<IStatsItemQuery>(TYPE.StatsItemQuery);
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

    it('returns Failure', async () => {
      const statsID: string = '428a0978-5d01-4da6-96f3-f851cb18e935';
      const stub: SinonStub = sinon.stub();
      StatsItemMySQLQuery.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<StatsItems, StatsItemsError>(new StatsItemsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemQuery: IStatsItemQuery = container.get<IStatsItemQuery>(TYPE.StatsItemQuery);
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
