import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { RedisString } from '../../../veau-general/Redis/RedisString';
import { Try } from '../../../veau-general/Try/Try';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { Region } from '../../../veau-vo/Region';
import { Regions } from '../../../veau-vo/Regions';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('Redis returns regions', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

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

    it('returns empty Regions when Redis returns null', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves(null);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isSuccess()).toEqual(true);
      const region: Region = trial.get();
      expect(region.getRegionID().get()).toEqual(2);
      expect(region.getName().get()).toEqual('Albania');
      expect(region.getISO3166().get()).toEqual('ALB');
    });

    it('Redis returns empty array', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[]');
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('Redis returns null', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves(null);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
