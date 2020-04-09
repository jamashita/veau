import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockError } from '../../../veau-general/MockError';
import { MockRedisError } from '../../../veau-general/Redis/MockRedisError';
import { MockRedis } from '../../../veau-general/Redis/mocks/MockRedis';
import { MockRedisString } from '../../../veau-general/Redis/mocks/MockRedisString';
import { Try } from '../../../veau-general/Try/Try';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language, LanguageJSON } from '../../../veau-vo/Language';
import { Languages } from '../../../veau-vo/Languages';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageRedisQuery);
      const languageQuery2: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageRedisQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        },
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = MockRedis.of({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const languages: Languages = trial.get();
      expect(languages.size()).toEqual(json.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get().getLanguageID().get()).toEqual(json[i].languageID);
        expect(languages.get(i).get().getName().get()).toEqual(json[i].name);
        expect(languages.get(i).get().getEnglishName().get()).toEqual(json[i].englishName);
        expect(languages.get(i).get().getISO639().get()).toEqual(json[i].iso639);
      }
    });

    it('Redis returns empty array', async () => {
      const json: Array<LanguageJSON> = [
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = MockRedis.of({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().size()).toEqual(json.length);
    });

    it('returns Failure when Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = MockRedis.of({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

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

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new MockRedisError());
      const redis: MockRedis = MockRedis.of({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new MockError());
      const redis: MockRedis = MockRedis.of({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      await expect(languageQuery.all()).rejects.toThrow(MockError);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        },
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = MockRedis.of({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isSuccess()).toEqual(true);
      const language: Language = trial.get();
      expect(language.getLanguageID().get()).toEqual(json[1].languageID);
      expect(language.getName().get()).toEqual(json[1].name);
      expect(language.getEnglishName().get()).toEqual(json[1].englishName);
      expect(language.getISO639().get()).toEqual(json[1].iso639);
    });

    it('Redis returns empty array', async () => {
      const json: Array<LanguageJSON> = [
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = MockRedis.of({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

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

    it('returns Failure because Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = MockRedis.of({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

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
      const json: Array<LanguageJSON> = [
        {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        },
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = MockRedis.of({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop'));

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

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new MockRedisError());
      const redis: MockRedis = MockRedis.of({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new MockError());
      const redis: MockRedis = MockRedis.of({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      expect(languageQuery.findByISO639(ISO639.of('aa'))).rejects.toThrow(MockError);
    });
  });
});
