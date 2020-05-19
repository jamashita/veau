import 'reflect-metadata';

import { DataSourceError, MockError, MockRedis, MockRedisString, RedisError, Superposition } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionName } from '../../../VO/Region/Mock/MockRegionName';
import { MockRegions } from '../../../VO/Region/Mock/MockRegions';
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
      const regions: MockRegions = new MockRegions(
        new MockRegion({
          name: new MockRegionName('sorella')
        }),
        new MockRegion({
          name: new MockRegionName('piment')
        }),
        new MockRegion({
          name: new MockRegionName('dein')
        })
      );

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
      const superposition: Superposition<unknown, DataSourceError> = await regionCommand.insertAll(regions);

      expect(stub1.withArgs('REGIONS', JSON.stringify(regions.toJSON())).called).toBe(true);
      expect(stub2.withArgs('REGIONS', 3 * 60 * 60).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws RedisError by MockRedisString.set', async () => {
      const regions: MockRegions = new MockRegions();

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.rejects(new RedisError('test failed'));
      const redis: MockRedis = new MockRedis({
        string
      });
      const stub2: SinonStub = sinon.stub();
      redis.expires = stub2;
      stub2.resolves();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await regionCommand.insertAll(regions);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because the client throws RedisError by MockRedis.expires', async () => {
      const regions: MockRegions = new MockRegions();

      const string: MockRedisString = new MockRedisString();
      const stub1: SinonStub = sinon.stub();
      string.set = stub1;
      stub1.resolves();
      const redis: MockRedis = new MockRedis({
        string
      });
      const stub2: SinonStub = sinon.stub();
      redis.expires = stub2;
      stub2.rejects(new RedisError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await regionCommand.insertAll(regions);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const regions: MockRegions = new MockRegions();

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
      const superposition: Superposition<unknown, DataSourceError> = await regionCommand.deleteAll();

      expect(stub.withArgs('REGIONS').called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead with CacheError because Redis.delete fails', async () => {
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.resolves(false);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await regionCommand.deleteAll();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because the client throws RedisError', async () => {
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.rejects(new RedisError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await regionCommand.deleteAll();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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
