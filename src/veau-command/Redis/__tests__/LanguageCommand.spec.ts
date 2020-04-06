import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { CacheError } from '../../../veau-error/CacheError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockRedisError } from '../../../veau-general/Redis/MockRedisError';
import { MockRedis } from '../../../veau-general/Redis/mocks/MockRedis';
import { MockRedisString } from '../../../veau-general/Redis/mocks/MockRedisString';
import { RedisError } from '../../../veau-general/Redis/RedisError';
import { Try } from '../../../veau-general/Try/Try';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Languages } from '../../../veau-vo/Languages';
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
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
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

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, DataSourceError> = await languageCommand.insertAll(languages);

      expect(stub1.withArgs('LANGUAGES', '[{"languageID":1,"name":"language 1","englishName":"english 1","iso639":"aa"}]').called).toEqual(true);
      expect(stub2.withArgs('LANGUAGES', 3 * 60 * 60).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure because the client throws RedisError by MockRedisString.set', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
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
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
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
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
      ]);
      const error: Error = new Error();

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.set = stub;
      stub.rejects(error);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const redis: MockRedis = MockRedis.of({
        string
      });

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      try {
        await languageCommand.insertAll(languages);
        spy1();
      }
      catch (err) {
        spy2();
        expect(err).toBe(error);
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const redis: MockRedis = MockRedis.of({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.resolves(true);

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      const trial: Try<void, CacheError | DataSourceError> = await languageCommand.deleteAll();

      expect(stub.withArgs('LANGUAGES').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure with CacheError because Redis.delete fails', async () => {
      const redis: MockRedis = MockRedis.of({});
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
      const redis: MockRedis = MockRedis.of({});
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
      const error: Error = new Error();

      const redis: MockRedis = MockRedis.of({});
      const stub: SinonStub = sinon.stub();
      redis.delete = stub;
      stub.rejects(error);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageCommand: LanguageCommand = new LanguageCommand(redis);
      try {
        await languageCommand.deleteAll();
        spy1();
      }
      catch (err) {
        spy2();
        expect(err).toBe(error);
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
