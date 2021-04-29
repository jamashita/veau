import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Language, LanguageJSON } from '../../../VO/Language/Language';
import { LanguageID } from '../../../VO/Language/LanguageID';
import { Languages } from '../../../VO/Language/Languages';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const languageQuery1: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageRedisQuery);
      const languageQuery2: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageRedisQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(10);

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
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const languages: Languages = schrodinger.get();

      expect(languages.size()).toBe(json.length);
      for (let i: number = 0; i < languages.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const languageID: LanguageID = LanguageID.ofString(json[i]!.languageID);
        const language: Nullable<Language> = languages.get(languageID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getLanguageID().get().get()).toBe(json[i]!.languageID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getName().get()).toBe(json[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getEnglishName().get()).toBe(json[i]!.englishName);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getISO639().get()).toBe(json[i]!.iso639);
      }
    });

    it('redis returns empty array', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().size()).toBe(json.length);
    });

    it('returns Dead when Redis returns null', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns RedisError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('{');
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      expect.assertions(5);

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
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const language: Language = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getLanguageID().get().get()).toBe(json[1]!.languageID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getName().get()).toBe(json[1]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getEnglishName().get()).toBe(json[1]!.englishName);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getISO639().get()).toBe(json[1]!.iso639);
    });

    it('redis returns empty array', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because Redis returns null', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('no match results', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('malformat languageID', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });

    it('redis returns RedisError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('{');
      const redis: MockRedis = new MockRedis({
        string
      });

      const languageQuery: LanguageQuery = new LanguageQuery(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });
  });
});
