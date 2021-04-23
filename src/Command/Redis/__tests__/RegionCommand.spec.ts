import { DataSourceError } from '@jamashita/anden-error';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { Schrodinger } from '@jamashita/genitore-superposition';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/catacombe-redis';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionName } from '../../../VO/Region/Mock/MockRegionName';
import { MockRegions } from '../../../VO/Region/Mock/MockRegions';
import { RegionCommand } from '../RegionCommand';

describe('RegionCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionCommand1: RegionCommand = kernel.get<RegionCommand>(Type.RegionRedisCommand);
      const regionCommand2: RegionCommand = kernel.get<RegionCommand>(Type.RegionRedisCommand);

      expect(regionCommand1).toBeInstanceOf(RegionCommand);
      expect(regionCommand1).toBe(regionCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      expect.assertions(3);

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
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.insertAll(regions).terminate();

      expect(stub1.withArgs('REGIONS', JSON.stringify(regions.toJSON())).called).toBe(true);
      expect(stub2.withArgs('REGIONS', 3 * 60 * 60).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws RedisError by MockRedisString.set', async () => {
      expect.assertions(2);

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

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.insertAll(regions).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('returns Dead because the client throws JSONAError', async () => {
      expect.assertions(2);

      const regions: MockRegions = new MockRegions();

      const stub1: SinonStub = sinon.stub();

      JSONA.stringify = stub1;
      stub1.throws(new JSONAError());
      const redis: MockRedis = new MockRedis();

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.insertAll(regions).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();

      redis.delete = stub;
      stub.resolves(true);

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.deleteAll().terminate();

      expect(stub.withArgs('REGIONS').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead with CacheError because Redis.delete fails', async () => {
      expect.assertions(2);

      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();

      redis.delete = stub;
      stub.resolves(false);

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.deleteAll().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('returns Dead because the client throws RedisError', async () => {
      expect.assertions(2);

      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();

      redis.delete = stub;
      stub.rejects(new RedisError('test failed'));

      const regionCommand: RegionCommand = new RegionCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.deleteAll().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });
});
