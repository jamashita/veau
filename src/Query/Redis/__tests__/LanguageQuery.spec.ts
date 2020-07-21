import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/publikum-redis';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import 'reflect-metadata';

import sinon, { SinonStub } from 'sinon';

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
      const schrodinger: Schrodinger<Languages,
        LanguagesError | DataSourceError> = await languageQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const languages: Languages = schrodinger.get();

      expect(languages.size()).toBe(json.length);
      for (let i: number = 0; i < languages.size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const languageID: LanguageID = await LanguageID.ofString(json[i].languageID).get();
        const language: Nullable<Language> = languages.get(languageID);

        expect(language?.getLanguageID().get().get()).toBe(json[i].languageID);
        expect(language?.getName().get()).toBe(json[i].name);
        expect(language?.getEnglishName().get()).toBe(json[i].englishName);
        expect(language?.getISO639().get()).toBe(json[i].iso639);
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
      const schrodinger: Schrodinger<Languages,
        LanguagesError | DataSourceError> = await languageQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().size()).toBe(json.length);
    });

    it('returns Dead when Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Languages,
        LanguagesError | DataSourceError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Languages,
        LanguagesError | DataSourceError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('Redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('{');
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Languages,
        LanguagesError | DataSourceError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
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
      const schrodinger: Schrodinger<Language,
        LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const language: Language = schrodinger.get();

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

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language,
        LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language,
        LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
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

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language,
        LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
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

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language,
        LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language,
        LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('Redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('{');
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language,
        LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });
});
