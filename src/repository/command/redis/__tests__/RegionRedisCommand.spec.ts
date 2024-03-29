import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger } from '@jamashita/genitore';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { cask } from '../../../../container/Cask';
import { Type } from '../../../../container/Types';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion';
import { MockRegionName } from '../../../../domain/vo/Region/mock/MockRegionName';
import { Regions } from '../../../../domain/vo/Region/Regions';
import { RegionRedisCommand } from '../RegionRedisCommand';

describe('RegionRedisCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionCommand1: RegionRedisCommand = cask.get<RegionRedisCommand>(Type.RegionRedisCommand);
      const regionCommand2: RegionRedisCommand = cask.get<RegionRedisCommand>(Type.RegionRedisCommand);

      expect(regionCommand1).toBeInstanceOf(RegionRedisCommand);
      expect(regionCommand1).toBe(regionCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      expect.assertions(3);

      const regions: Regions = Regions.ofSpread(
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

      const regionCommand: RegionRedisCommand = new RegionRedisCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.insertAll(regions).terminate();

      expect(stub1.withArgs('REGIONS', JSON.stringify(regions.toJSON())).called).toBe(true);
      expect(stub2.withArgs('REGIONS', 3 * 60 * 60).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws RedisError by MockRedisString.set', async () => {
      expect.assertions(2);

      const regions: Regions = Regions.empty();

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

      const regionCommand: RegionRedisCommand = new RegionRedisCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.insertAll(regions).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('returns Dead because the client throws JSONAError', async () => {
      expect.assertions(2);

      const regions: Regions = Regions.empty();

      const stub1: SinonStub = sinon.stub();

      JSONA.stringify = stub1;
      stub1.throws(new JSONAError());
      const redis: MockRedis = new MockRedis();

      const regionCommand: RegionRedisCommand = new RegionRedisCommand(redis);
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

      const regionCommand: RegionRedisCommand = new RegionRedisCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.deleteAll().terminate();

      expect(stub.withArgs('REGIONS').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead with HeapError because Redis.delete fails', async () => {
      expect.assertions(2);

      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();

      redis.delete = stub;
      stub.resolves(false);

      const regionCommand: RegionRedisCommand = new RegionRedisCommand(redis);
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

      const regionCommand: RegionRedisCommand = new RegionRedisCommand(redis);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await regionCommand.deleteAll().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });
});
