import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { CacheError } from '../../../veau-error/CacheError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockError } from '../../../veau-general/MockError';
import { MockRedisError } from '../../../veau-general/Redis/MockRedisError';
import { MockRedis } from '../../../veau-general/Redis/mocks/MockRedis';
import { MockRedisString } from '../../../veau-general/Redis/mocks/MockRedisString';
import { RedisError } from '../../../veau-general/Redis/RedisError';
import { Try } from '../../../veau-general/Try/Try';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { Regions } from '../../../veau-vo/Regions';
import { RegionCommand } from '../RegionCommand';

describe('RegionCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionCommand1: RegionCommand = kernel.get<RegionCommand>(TYPE.RegionRedisCommand);
      const regionCommand2: RegionCommand = kernel.get<RegionCommand>(TYPE.RegionRedisCommand);

      expect(regionCommand1).toBeInstanceOf(RegionCommand);
      expect(regionCommand1).toBe(regionCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      const regions: Regions = Regions.of([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.resolves();
      const redis: MockRedis = MockRedis.of({
        string
      });
      const stub2: SinonStub = sinon.stub();
      redis.expires = stub2;
      stub2.resolves();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const trial: Try<void, DataSourceError> = await regionCommand.insertAll(regions);

      expect(stub1.withArgs('REGIONS', JSON.stringify(regions.toJSON())).called).toEqual(true);
      expect(stub2.withArgs('REGIONS', 3 * 60 * 60).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws RedisError by MockRedisString.set', async () => {
      const regions: Regions = Regions.of([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.rejects(new MockRedisError());
      const redis: MockRedis = MockRedis.of({
        string
      });
      const stub2: SinonStub = sinon.stub();
      redis.expires = stub2;
      stub2.resolves();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const trial: Try<void, DataSourceError> = await regionCommand.insertAll(regions);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws RedisError by MockRedis.expires', async () => {
      const regions: Regions = Regions.of([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.resolves();
      const redis: MockRedis = MockRedis.of({
        string
      });
      const stub2: SinonStub = sinon.stub();
      redis.expires = stub2;
      stub2.rejects(new MockRedisError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const trial: Try<void, DataSourceError> = await regionCommand.insertAll(regions);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const regions: Regions = Regions.of([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.set = stub;
      stub.rejects(new MockError());

      const redis: MockRedis = MockRedis.of({
        string
      });

      const regionCommand: RegionCommand = new RegionCommand(redis);
      await expect(regionCommand.insertAll(regions)).rejects.toThrow(MockError);
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const redis: MockRedis = MockRedis.of({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.resolves(true);

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await regionCommand.deleteAll();

      expect(stub.withArgs('REGIONS').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure with CacheError because Redis.delete fails', async () => {
      const redis: MockRedis = MockRedis.of({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.resolves(false);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await regionCommand.deleteAll();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(CacheError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws RedisError', async () => {
      const redis: MockRedis = MockRedis.of({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.rejects(new MockRedisError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await regionCommand.deleteAll();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const redis: MockRedis = MockRedis.of({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.rejects(new MockError());

      const regionCommand: RegionCommand = new RegionCommand(redis);
      await expect(regionCommand.deleteAll()).rejects.toThrow(MockError);
    });
  });
});
