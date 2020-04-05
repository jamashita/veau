import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { RegionCommand } from '../../veau-command/RegionCommand';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { Regions } from '../../veau-vo/Regions';
import { RegionQuery as RegionMySQLQuery } from '../MySQL/RegionQuery';
import { RegionQuery as RegionRedisQuery } from '../Redis/RegionQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = container.get<RegionQuery>(TYPE.RegionQuery);
      const regionQuery2: RegionQuery = container.get<RegionQuery>(TYPE.RegionQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('LanguageRedisQuery returns languages', async () => {
      const stub: SinonStub = sinon.stub();
      RegionRedisQuery.prototype.all = stub;
      stub.resolves(Success.of<Regions, NoSuchElementError>(Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ])));

      const regionQuery: RegionQuery = container.get<RegionQuery>(TYPE.RegionQuery);
      const trial: Try<Regions, NoSuchElementError>= await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const regions: Regions = trial.get();
      expect(regions.size()).toEqual(2);
      expect(regions.get(0).get().getRegionID().get()).toEqual(1);
      expect(regions.get(0).get().getName().get()).toEqual('Afghanistan');
      expect(regions.get(0).get().getISO3166().get()).toEqual('AFG');
      expect(regions.get(1).get().getRegionID().get()).toEqual(2);
      expect(regions.get(1).get().getName().get()).toEqual('Albania');
      expect(regions.get(1).get().getISO3166().get()).toEqual('ALB');
    });

    it('LanguageMySQLQuery returns languages', async () => {
      const stub1: SinonStub = sinon.stub();
      RegionRedisQuery.prototype.all = stub1;
      stub1.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const stub2: SinonStub = sinon.stub();
      RegionMySQLQuery.prototype.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ])));
      const stub3: SinonStub = sinon.stub();
      RegionCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const regionQuery: RegionQuery = container.get<RegionQuery>(TYPE.RegionQuery);
      const trial: Try<Regions, NoSuchElementError>= await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const regions: Regions = trial.get();
      expect(regions.size()).toEqual(2);
      expect(regions.get(0).get().getRegionID().get()).toEqual(1);
      expect(regions.get(0).get().getName().get()).toEqual('Afghanistan');
      expect(regions.get(0).get().getISO3166().get()).toEqual('AFG');
      expect(regions.get(1).get().getRegionID().get()).toEqual(2);
      expect(regions.get(1).get().getName().get()).toEqual('Albania');
      expect(regions.get(1).get().getISO3166().get()).toEqual('ALB');
      expect(stub3.called).toEqual(true);
    });
  });

  describe('findByISO3166', () => {
    it('Redis returns a region', async () => {
      const stub: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub;
      stub.resolves(Success.of<Regions, NoSuchElementError>(Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ])));

      const regionQuery: RegionQuery = container.get<RegionQuery>(TYPE.RegionQuery);
      const trial: Try<Region, NoSuchElementError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isSuccess()).toEqual(true);
      const region: Region = trial.get();
      expect(region.getRegionID().get()).toEqual(2);
      expect(region.getName().get()).toEqual('Albania');
      expect(region.getISO3166().get()).toEqual('ALB');
    });

    it('RegionQuery.all returns Failure', async () => {
      const stub: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub;
      stub.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = container.get<RegionQuery>(TYPE.RegionQuery);
      const trial: Try<Region, NoSuchElementError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('no match results', async () => {
      const stub: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub;
      stub.resolves(Success.of<Regions, NoSuchElementError>(Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ])));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = container.get<RegionQuery>(TYPE.RegionQuery);
      const trial: Try<Region, NoSuchElementError> = await regionQuery.findByISO3166(ISO3166.of('AIO'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        expect(err).toBeInstanceOf(NoSuchElementError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
