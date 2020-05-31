import 'reflect-metadata';

import sinon, { SinonSpy, SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/publikum-redis';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageName } from '../../../VO/Language/Mock/MockLanguageName';
import { MockLanguages } from '../../../VO/Language/Mock/MockLanguages';
import { LanguageCommand } from '../LanguageCommand';

describe('LanguageCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageCommand1: LanguageCommand = kernel.get<LanguageCommand>(Type.LanguageRedisCommand);
      const languageCommand2: LanguageCommand = kernel.get<LanguageCommand>(Type.LanguageRedisCommand);

      expect(languageCommand1).toBeInstanceOf(LanguageCommand);
      expect(languageCommand1).toBe(languageCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      const languages: MockLanguages = new MockLanguages(
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
      const superposition: Superposition<unknown, DataSourceError> = await languageCommand.insertAll(languages);

      expect(stub1.withArgs('LANGUAGES', JSON.stringify(languages.toJSON())).called).toBe(true);
      expect(stub2.withArgs('LANGUAGES', 3 * 60 * 60).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws RedisError by MockRedisString.set', async () => {
      const languages: MockLanguages = new MockLanguages();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await languageCommand.insertAll(languages);

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
      const languages: MockLanguages = new MockLanguages();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await languageCommand.insertAll(languages);

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
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();

      redis.delete = stub;
      stub.resolves(true);

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await languageCommand.deleteAll();

      expect(stub.withArgs('LANGUAGES').called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead with CacheError because Redis.delete fails', async () => {
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();

      redis.delete = stub;
      stub.resolves(false);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await languageCommand.deleteAll();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const superposition: Superposition<unknown, DataSourceError> = await languageCommand.deleteAll();

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
  });
});
