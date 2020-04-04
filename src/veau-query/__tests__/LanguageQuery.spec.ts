import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { RedisString } from '../../veau-general/Redis/RedisString';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { LanguageRedisQuery } from '../LanguageRedisQuery';

describe('LanguageRedisQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageRedisQuery = container.get<LanguageRedisQuery>(TYPE.LanguageRedisQuery);
      const languageQuery2: LanguageRedisQuery = container.get<LanguageRedisQuery>(TYPE.LanguageRedisQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageRedisQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');

      const languageQuery: LanguageRedisQuery = container.get<LanguageRedisQuery>(TYPE.LanguageRedisQuery);
      const languages: Languages = await languageQuery.all();

      expect(languages.size()).toEqual(2);
      expect(languages.get(0).get().getLanguageID().get()).toEqual(1);
      expect(languages.get(0).get().getName().get()).toEqual('аҧсуа бызшәа');
      expect(languages.get(0).get().getEnglishName().get()).toEqual('Abkhazian');
      expect(languages.get(0).get().getISO639().get()).toEqual('ab');
      expect(languages.get(1).get().getLanguageID().get()).toEqual(2);
      expect(languages.get(1).get().getName().get()).toEqual('Afaraf');
      expect(languages.get(1).get().getEnglishName().get()).toEqual('Afar');
      expect(languages.get(1).get().getISO639().get()).toEqual('aa');
    });

    it('returns empty Languages when Redis returns null', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves(null);

      const languageQuery: LanguageRedisQuery = container.get<LanguageRedisQuery>(TYPE.LanguageRedisQuery);
      const languages: Languages = await languageQuery.all();

      expect(languages.isEmpty()).toEqual(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');

      const languageQuery: LanguageRedisQuery = container.get<LanguageRedisQuery>(TYPE.LanguageRedisQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isSuccess()).toEqual(true);
      const language: Language = trial.get();
      expect(language.getLanguageID().get()).toEqual(2);
      expect(language.getName().get()).toEqual('Afaraf');
      expect(language.getEnglishName().get()).toEqual('Afar');
    });

    it('Redis returns empty array', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[]');
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageRedisQuery = container.get<LanguageRedisQuery>(TYPE.LanguageRedisQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        expect(err).toBeInstanceOf(NoSuchElementError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('Redis returns null', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves(null);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageRedisQuery = container.get<LanguageRedisQuery>(TYPE.LanguageRedisQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        expect(err).toBeInstanceOf(NoSuchElementError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
