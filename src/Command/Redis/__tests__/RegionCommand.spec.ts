import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { CacheError } from '../../../Error/CacheError';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/MockError';
import { MockRedisError } from '../../../General/Redis/Mock/MockRedisError';
import { MockRedis } from '../../../General/Redis/Mock/MockRedis';
import { MockRedisString } from '../../../General/Redis/Mock/MockRedisString';
import { RedisError } from '../../../General/Redis/RedisError';
import { Try } from '../../../General/Try/Try';
import { ISO3166 } from '../../../VO/ISO3166';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { Regions } from '../../../VO/Regions';
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
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.resolves();
      const redis: MockRedis = new MockRedis({
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
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.rejects(new MockRedisError());
      const redis: MockRedis = new MockRedis({
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
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.resolves();
      const redis: MockRedis = new MockRedis({
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
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.set = stub;
      stub.rejects(new MockError());

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionCommand: RegionCommand = new RegionCommand(redis);
      await expect(regionCommand.insertAll(regions)).rejects.toThrow(MockError);
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.resolves(true);

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await regionCommand.deleteAll();

      expect(stub.withArgs('REGIONS').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure with CacheError because Redis.delete fails', async () => {
      const redis: MockRedis = new MockRedis({});
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
      const redis: MockRedis = new MockRedis({});
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
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.rejects(new MockError());

      const regionCommand: RegionCommand = new RegionCommand(redis);
      await expect(regionCommand.deleteAll()).rejects.toThrow(MockError);
    });
  });
});