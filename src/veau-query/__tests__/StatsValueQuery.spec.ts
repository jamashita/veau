import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { AsOf } from '../../veau-vo/AsOf';
import { NumericalValue } from '../../veau-vo/NumericalValue';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { IStatsValueQuery } from '../interfaces/IStatsValueQuery';
import { StatsValueQuery as StatsValueMySQLQuery } from '../MySQL/StatsValueQuery';
import { StatsValueQuery } from '../StatsValueQuery';

describe('StatsValueQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsValueQuery1: IStatsValueQuery = container.get<IStatsValueQuery>(TYPE.StatsValueQuery);
      const statsValueQuery2: IStatsValueQuery = container.get<IStatsValueQuery>(TYPE.StatsValueQuery);

      expect(statsValueQuery1).toBeInstanceOf(StatsValueQuery);
      expect(statsValueQuery1).toBe(statsValueQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      StatsValueMySQLQuery.prototype.findByStatsID = stub;
      stub.resolves(Success.of<StatsValues, StatsValuesError>(StatsValues.of([
        StatsValue.of(StatsItemID.of('98d1e9b5-6b18-44de-b615-d8016f49977d').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('5318ad74-f15f-4835-9fd7-890be4cce933').get(), AsOf.ofString('2001-01-01').get(), NumericalValue.of(11)),
        StatsValue.of(StatsItemID.of('98d1e9b5-6b18-44de-b615-d8016f49977d').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(2)),
        StatsValue.of(StatsItemID.of('5318ad74-f15f-4835-9fd7-890be4cce933').get(), AsOf.ofString('2001-01-02').get(), NumericalValue.of(12)),
        StatsValue.of(StatsItemID.of('98d1e9b5-6b18-44de-b615-d8016f49977d').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(3)),
      ])));

      const statsValueQuery: StatsValueQuery = container.get<StatsValueQuery>(TYPE.StatsValueQuery);
      const trial: Try<StatsValues, StatsValuesError> = await statsValueQuery.findByStatsID(StatsID.of('d4703058-a6ff-420b-95b2-4475beba9027').get());

      expect(trial.isSuccess()).toEqual(true);
      const values: StatsValues = trial.get();

      const year2001: StatsValues = values.filter(StatsItemID.of('5318ad74-f15f-4835-9fd7-890be4cce933').get());

      expect(year2001.size()).toEqual(2);
      expect(year2001.get(0).get().getAsOf().toString()).toEqual('2001-01-01');
      expect(year2001.get(0).get().getValue().get()).toEqual(11);
      expect(year2001.get(1).get().getAsOf().toString()).toEqual('2001-01-02');
      expect(year2001.get(1).get().getValue().get()).toEqual(12);

      const year2000: StatsValues = values.filter(StatsItemID.of('98d1e9b5-6b18-44de-b615-d8016f49977d').get());

      expect(year2000.size()).toEqual(3);
      expect(year2000.get(0).get().getAsOf().toString()).toEqual('2000-01-01');
      expect(year2000.get(0).get().getValue().get()).toEqual(1);
      expect(year2000.get(1).get().getAsOf().toString()).toEqual('2000-01-02');
      expect(year2000.get(1).get().getValue().get()).toEqual(2);
      expect(year2000.get(2).get().getAsOf().toString()).toEqual('2000-01-03');
      expect(year2000.get(2).get().getValue().get()).toEqual(3);
    });

    it('returns Failure', async () => {
      const stub: SinonStub = sinon.stub();
      StatsValueMySQLQuery.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<StatsValues, StatsValuesError>(new StatsValuesError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();


      const statsValueQuery: StatsValueQuery = container.get<StatsValueQuery>(TYPE.StatsValueQuery);
      const trial: Try<StatsValues, StatsValuesError> = await statsValueQuery.findByStatsID(StatsID.of('d4703058-a6ff-420b-95b2-4475beba9027').get());

      expect(trial.isFailure()).toEqual(true);

      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
