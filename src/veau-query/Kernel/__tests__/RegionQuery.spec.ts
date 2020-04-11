import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockRegionCommand } from '../../../veau-command/Mock/MockRegionCommand';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockMySQLError } from '../../../veau-general/MySQL/mocks/MockMySQLError';
import { MockRedisError } from '../../../veau-general/Redis/MockRedisError';
import { RedisError } from '../../../veau-general/Redis/RedisError';
import { Failure } from '../../../veau-general/Try/Failure';
import { Success } from '../../../veau-general/Try/Success';
import { Try } from '../../../veau-general/Try/Try';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { Regions } from '../../../veau-vo/Regions';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionKernelQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionKernelQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('RegionRedisQuery returns Success', async () => {
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub: SinonStub = sinon.stub();
      regionRedisQuery.all = stub;
      stub.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const trial: Try<Regions, NoSuchElementError | DataSourceError>= await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(regions);
    });

    it('RegionMySQLQuery returns Success', async () => {
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Regions, DataSourceError>(new MockMySQLError()));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();
      regionRedisCommand.insertAll= stub3;
      stub3.resolves(Success.of<DataSourceError>());

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand)
      const trial: Try<Regions, NoSuchElementError | DataSourceError>= await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(regions);
    });

    it('RegionRedisQuery nor RegionMySQLQuery returns Failure', async () => {
      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();
      regionRedisCommand.insertAll= stub3;
      stub3.resolves(Success.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand)
      const trial: Try<Regions, NoSuchElementError | DataSourceError>= await regionQuery.all();

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

    it('RegionCommand returns Failure', async () => {
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();
      regionRedisCommand.insertAll= stub3;
      stub3.resolves(Failure.of<DataSourceError>(new MockRedisError()));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand)
      const trial: Try<Regions, NoSuchElementError | DataSourceError>= await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub: SinonStub = sinon.stub();
      regionRedisQuery.all = stub;
      stub.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(regions.get(1).get());
    });

    it('RegionQuery.all returns Failure', async () => {
      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
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

    it('no match results', async () => {
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('AIO'));

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
