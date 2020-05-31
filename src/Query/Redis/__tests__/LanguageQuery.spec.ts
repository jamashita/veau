import 'reflect-metadata';

import sinon, { SinonSpy, SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/publikum-redis';
import { UUID } from '@jamashita/publikum-uuid';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../../VO/Language/Error/LanguagesError';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Language, LanguageJSON } from '../../../VO/Language/Language';
import { LanguageID } from '../../../VO/Language/LanguageID';
import { Languages } from '../../../VO/Language/Languages';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageRedisQuery);
      const languageQuery2: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageRedisQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: UUID.v4().get(),
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: UUID.v4().get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await languageQuery.all();

      expect(superposition.isAlive()).toBe(true);
      const languages: Languages = superposition.get();

      expect(languages.size()).toBe(json.length);
      for (let i: number = 0; i < languages.size(); i++) {
        const languageID: LanguageID = LanguageID.ofString(json[i].languageID).get();

        expect(languages.get(languageID).get().getLanguageID().get().get()).toBe(json[i].languageID);
        expect(languages.get(languageID).get().getName().get()).toBe(json[i].name);
        expect(languages.get(languageID).get().getEnglishName().get()).toBe(json[i].englishName);
        expect(languages.get(languageID).get().getISO639().get()).toBe(json[i].iso639);
      }
    });

    it('Redis returns empty array', async () => {
      const json: Array<LanguageJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await languageQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get().size()).toBe(json.length);
    });

    it('returns Dead when Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await languageQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguagesError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await languageQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguagesError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('{');
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await languageQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguagesError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: UUID.v4().get(),
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: UUID.v4().get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isAlive()).toBe(true);
      const language: Language = superposition.get();

      expect(language.getLanguageID().get().get()).toBe(json[1].languageID);
      expect(language.getName().get()).toBe(json[1].name);
      expect(language.getEnglishName().get()).toBe(json[1].englishName);
      expect(language.getISO639().get()).toBe(json[1].iso639);
    });

    it('Redis returns empty array', async () => {
      const json: Array<LanguageJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('no match results', async () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: UUID.v4().get(),
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: UUID.v4().get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('oop'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('malformat languageID', async () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: 'ccio',
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 'cchio',
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('oop'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(LanguageError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('{');
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
