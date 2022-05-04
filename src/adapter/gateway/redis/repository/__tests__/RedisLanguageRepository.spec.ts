import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import 'reflect-metadata';
import { ISO639 } from '../../../../../domain/Language/ISO639';
import { Language, LanguageJSON } from '../../../../../domain/Language/Language';
import { LanguageError } from '../../../../../domain/Language/LanguageError';
import { LanguageID } from '../../../../../domain/Language/LanguageID';
import { Languages } from '../../../../../domain/Language/Languages';
import { NoSuchElementError } from '../../../../../repository/query/error/NoSuchElementError';
import { RedisLanguageRepository } from '../RedisLanguageRepository';

describe('RedisLanguageRepository', () => {
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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageRepository.all();

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
      const json: Array<LanguageJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageRepository.all();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().size()).toBe(json.length);
    });

    it('returns Dead when Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(null);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.reject(new RedisError('test failed'));
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve('{');
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await languageRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageRepository.findByISO639(ISO639.of('aa'));

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
      const json: Array<LanguageJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageRepository.findByISO639(ISO639.of('aa'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(null);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageRepository.findByISO639(ISO639.of('aa'));

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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageRepository.findByISO639(ISO639.of('oop'));

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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageRepository.findByISO639(ISO639.of('oop'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });

    it('redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.reject(new RedisError('test failed'));
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageRepository.findByISO639(ISO639.of('aa'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve('{');
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const languageRepository: RedisLanguageRepository = new RedisLanguageRepository(redis);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | RedisError> = await languageRepository.findByISO639(ISO639.of('aa'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });
  });
});
