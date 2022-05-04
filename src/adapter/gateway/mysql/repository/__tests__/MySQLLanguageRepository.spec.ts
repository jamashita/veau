import { UUID } from '@jamashita/anden-uuid';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { ISO639 } from '../../../../../domain/Language/ISO639';
import { Language, LanguageRow } from '../../../../../domain/Language/Language';
import { LanguageError } from '../../../../../domain/Language/LanguageError';
import { LanguageID } from '../../../../../domain/Language/LanguageID';
import { Languages } from '../../../../../domain/Language/Languages';
import { NoSuchElementError } from '../../../../../repository/query/error/NoSuchElementError';
import { MySQLLanguageRepository } from '../MySQLLanguageRepository';

describe('MySQLLanguageRepository', () => {
  describe('all', () => {
    it('normal case', async () => {
      const rows: Array<LanguageRow> = [
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

      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve(rows);
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Languages, LanguageError | MySQLError> = await languageRepository.all();

      expect(spy).toHaveBeenCalled();
      expect(schrodinger.isAlive()).toBe(true);

      const languages: Languages = schrodinger.get();

      expect(languages.size()).toBe(2);
      for (let i: number = 0; i < languages.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const languageID: LanguageID = LanguageID.ofString(rows[i]!.languageID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getLanguageID().get().get()).toBe(rows[i]!.languageID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getName().get()).toBe(rows[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getEnglishName().get()).toBe(rows[i]!.englishName);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getISO639().get()).toBe(rows[i]!.iso639);
      }
    });

    it('returns Dead when MySQL.execute returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Languages, LanguageError | MySQLError> = await languageRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.reject(new MySQLError('test failed'));
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Languages, LanguageError | MySQLError> = await languageRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const rows: Array<LanguageRow> = [
        {
          languageID: uuid.get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve(rows);
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageRepository.find(LanguageID.of(uuid));

      expect(spy).toHaveBeenCalled();
      expect(schrodinger.isAlive()).toBe(true);

      const language: Language = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getLanguageID().get().get()).toBe(rows[0]!.languageID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getEnglishName().get()).toBe(rows[0]!.englishName);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getISO639().get()).toBe(rows[0]!.iso639);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageRepository.find(LanguageID.ofString('fb339018-f065-4b12-a87d-697aa8da94c9'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.reject(new MySQLError('test failed'));
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageRepository.find(LanguageID.ofString('17afde94-21d3-41f1-bee5-c163766719a4'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const rows: Array<LanguageRow> = [
        {
          languageID: UUID.v4().get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve(rows);
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageRepository.findByISO639(ISO639.of('aa'));

      expect(spy).toHaveBeenCalled();
      expect(schrodinger.isAlive()).toBe(true);
      const language: Language = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getLanguageID().get().get()).toBe(rows[0]!.languageID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getEnglishName().get()).toBe(rows[0]!.englishName);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getISO639().get()).toBe(rows[0]!.iso639);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageRepository.findByISO639(ISO639.of('aa'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.reject(new MySQLError('test failed'));
      });

      const languageRepository: MySQLLanguageRepository = new MySQLLanguageRepository(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageRepository.findByISO639(ISO639.of('aa'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
