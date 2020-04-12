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
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Languages } from '../../../VO/Languages';
import { LanguageCommand } from '../LanguageCommand';

describe('LanguageCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageCommand1: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageRedisCommand);
      const languageCommand2: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageRedisCommand);

      expect(languageCommand1).toBeInstanceOf(LanguageCommand);
      expect(languageCommand1).toBe(languageCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      const languages: Languages = Languages.ofArray([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, DataSourceError> = await languageCommand.insertAll(languages);

      expect(stub1.withArgs('LANGUAGES', JSON.stringify(languages.toJSON())).called).toEqual(true);
      expect(stub2.withArgs('LANGUAGES', 3 * 60 * 60).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws RedisError by MockRedisString.set', async () => {
      const languages: Languages = Languages.ofArray([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, DataSourceError> = await languageCommand.insertAll(languages);

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
      const languages: Languages = Languages.ofArray([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, DataSourceError> = await languageCommand.insertAll(languages);

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
      const languages: Languages = Languages.ofArray([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
      ]);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.set = stub;
      stub.rejects(new MockError());
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      await expect(languageCommand.insertAll(languages)).rejects.toThrow(MockError);
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.resolves(true);

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await languageCommand.deleteAll();

      expect(stub.withArgs('LANGUAGES').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure with CacheError because Redis.delete fails', async () => {
      const redis: MockRedis = new MockRedis({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.resolves(false);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await languageCommand.deleteAll();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await languageCommand.deleteAll();

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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      await expect(languageCommand.deleteAll()).rejects.toThrow(MockError);
    });
  });
});
