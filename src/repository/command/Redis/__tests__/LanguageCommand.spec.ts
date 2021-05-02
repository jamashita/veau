import { MockRedis, MockRedisString, RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger } from '@jamashita/genitore';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../../container/Kernel';
import { Type } from '../../../../container/Types';
import { Languages } from '../../../../domain/vo/Language/Languages';
import { MockLanguage } from '../../../../domain/vo/Language/Mock/MockLanguage';
import { MockLanguageName } from '../../../../domain/vo/Language/Mock/MockLanguageName';
import { LanguageCommand } from '../LanguageCommand';

describe('LanguageCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const languageCommand1: LanguageCommand = kernel.get<LanguageCommand>(Type.LanguageRedisCommand);
      const languageCommand2: LanguageCommand = kernel.get<LanguageCommand>(Type.LanguageRedisCommand);

      expect(languageCommand1).toBeInstanceOf(LanguageCommand);
      expect(languageCommand1).toBe(languageCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      expect.assertions(3);

      const languages: Languages = Languages.ofSpread(
        new MockLanguage({
          name: new MockLanguageName('lorsque')
        }),
        new MockLanguage({
          name: new MockLanguageName('soreil')
        }),
        new MockLanguage({
          name: new MockLanguageName('kotlin')
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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const schrodinger: Schrodinger<unknown, RedisError> = await languageCommand.insertAll(languages).terminate();

      expect(stub1.withArgs('LANGUAGES', JSON.stringify(languages.toJSON())).called).toBe(true);
      expect(stub2.withArgs('LANGUAGES', 3 * 60 * 60).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws RedisError by MockRedisString.set', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.empty();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const schrodinger: Schrodinger<unknown, RedisError> = await languageCommand.insertAll(languages).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('returns Dead because the client throws JSONAError', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.empty();

      const stub1: SinonStub = sinon.stub();

      JSONA.stringify = stub1;
      stub1.throws(new JSONAError());
      const redis: MockRedis = new MockRedis();

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const schrodinger: Schrodinger<unknown, RedisError> = await languageCommand.insertAll(languages).terminate();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const schrodinger: Schrodinger<unknown, RedisError> = await languageCommand.deleteAll().terminate();

      expect(stub.withArgs('LANGUAGES').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead with HeapError because Redis.delete fails', async () => {
      expect.assertions(2);

      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();

      redis.delete = stub;
      stub.resolves(false);

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const schrodinger: Schrodinger<unknown, RedisError> = await languageCommand.deleteAll().terminate();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const schrodinger: Schrodinger<unknown, RedisError> = await languageCommand.deleteAll().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });
});
